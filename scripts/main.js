let terminal = document.getElementById('terminal');
function print(...buffer)
{
    if(buffer[0] == "%CLEAR")
    {
        terminal.innerHTML = "";
        return;
    }
    for(let i = 0; i < buffer.length; ++i)
    {
        terminal.innerHTML += buffer[i];
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//let canvas = document.getElementById("canvas");
//let buffer = canvas.getContext("2d");

//function update()
//{   
//}

function getRand(min = 0, max = 1)
{
    return min + (Math.random() * (max - min));
}

function MLP(nInputs, nHidden, nOutputs, chromosome = null)
{
    this.nInputs = nInputs;
    this.nHidden = nHidden;
    this.nOutputs = nOutputs;
    this.hiddenL = [];
    this.outputL =[];
    this.chromosome = [];
    this.outputResults = [];

    this.defaultConstructor = function()
    {
        for(let i = 0; i < nHidden; ++i)
        {
            this.hiddenL.push([]);
            for(let j = 0; j <= nInputs; ++j)
            {
                let weight = getRand(-4, 4);
                this.hiddenL[i].push(weight);
                this.chromosome.push(weight);
            }
        }
        
        for(let i = 0; i < nOutputs; ++i)
        {
            this.outputL.push([]);
            for(let j = 0; j <= nHidden; ++j)
            {
                let weight = getRand(-4, 4);
                this.outputL[i].push(weight);
                this.chromosome.push(weight);
            }
        }
    }

    this.geneConstructor = function(chromosome)
    {
        let arrayPos = 0;
        for(let i = 0; i < nHidden; ++i)
        {
            this.hiddenL.push([]);
            for(let j = 0; j <= nInputs; ++j)
            {
                this.hiddenL[i].push(chromosome[arrayPos]);
                this.chromosome.push(chromosome[arrayPos]);
                arrayPos++;
            }
        }
        
        for(let i = 0; i < nOutputs; ++i)
        {
            this.outputL.push([]);
            for(let j = 0; j <= nHidden; ++j)
            {
                this.outputL[i].push(chromosome[arrayPos]);
                this.chromosome.push(chromosome[arrayPos]);
                arrayPos++;
            }
        }
    }

    if(chromosome === null)
        this.defaultConstructor();
    else
        this.geneConstructor(chromosome);

    this.hiddenActivationFunc = function(val)
    {
        //return Math.max(0, val);
        return Math.tanh(val);
    }

    this.outputActivationFunc = function(val)
    {
        if(val >= 0)
            return 1;

        return 0;
    }

    this.input = function(input)
    {
        this.outputResults = [];
        let hiddenLResults = [];
        for(let i = 0; i < this.nHidden; ++i)
        {
            let netInput = 0;
            for(let j = 0; j < this.nInputs; ++j)
            {
                netInput += this.hiddenL[i][j] * input[j];
            }

            netInput += this.hiddenL[i][this.nInputs];
            hiddenLResults.push(this.hiddenActivationFunc(netInput));
        }
               
        for(let i = 0; i < this.nOutputs; ++i)
        {
            let netInput = 0
            for(let j = 0; j < hiddenLResults.length; ++j)
            {
                netInput += this.outputL[i][j] * hiddenLResults[j];
            }

            netInput += this.outputL[i][this.nHidden];
            this.outputResults.push(this.outputActivationFunc(netInput));
        }
    }

    this.getChromosome = function()
    {
        let copy = [];
        for(let i = 0; i < this.chromosome.length; ++i)
        {
            copy.push(this.chromosome[i]);
        }

        return copy;
    }

    this.getOutput = function()
    {
        let copy = [];
        for(let i = 0; i < this.outputResults.length; ++i)
        {
            copy.push(this.outputResults[i]);
        }

        return copy;
    }
}

function breed(parent1, parent2)
{
    let splitIndex = Math.floor(getRand(0, parent1.length));
    let childChromosome = [];
    for(let i = 0; i < splitIndex; ++i)
    {
        childChromosome.push(parent1[i]);
    }
    
    for(let i = splitIndex; i < parent2.length; ++i)
    {
        childChromosome.push(parent2[i]);
    }
    
    return childChromosome;
}

function getNextGen(netList, successRate)
{
    let nInputs = netList[0].nInputs;
    let nHidden = netList[0].nHidden;
    let nOutputs = netList[0].nOutputs;
    let newGen = [];

    for(let i = 0; i < netList.length / 2; ++i)
    {
        let parent1 = getRand();
        let parent2 = getRand();

        let index1 = 0;
        for(let j = 0; j < successRate.length; ++j)
        {
            if(parent1 <= successRate[j])
                break;
            
            index1++;
        }

        let index2 = 0;
        for(let j = 0; j < successRate.length; ++j)
        {
            if(parent2 <= successRate[j])
                break;
            
            index2++;
        }
        
        let chromosome1 = netList[index1].getChromosome();
        let chromosome2 = netList[index2].getChromosome();

        let childChromosome1 = breed(chromosome1, chromosome2);
        let childChromosome2 = breed(chromosome1, chromosome2);
        
        let mutation = getRand(0, 100);
        if(mutation > 95)
        {
            let mutationIndex = Math.floor(getRand(0, childChromosome1.length));
            childChromosome1[mutationIndex] = getRand(-4, 4);
            
            mutationIndex = Math.floor(getRand(0, childChromosome2.length));
            childChromosome2[mutationIndex] = getRand(-4, 4);
        }
        
        mutation = getRand(0, 100);
        if(mutation > 98)
        {
            let mutationIndex = Math.floor(getRand(0, childChromosome1.length));
            childChromosome1[mutationIndex] += getRand(-0.02, 0.02);
            
            mutationIndex = Math.floor(getRand(0, childChromosome2.length));
            childChromosome2[mutationIndex] = getRand(-0.02, 0.02);
        }

        newGen.push(new MLP(nInputs, nHidden, nOutputs, childChromosome1));
        newGen.push(new MLP(nInputs, nHidden, nOutputs, childChromosome2));
    }

    return newGen;
}

function getSuccessRate(fitnesses)
{
    let sum = 0
    for(let i = 0; i < fitnesses.length; ++i)
    {
        sum += fitnesses[i];
    }
    
    let successRate = [];
    let prev = 0;
    for(let i = 0; i < fitnesses.length; ++i)
    {
        successRate.push(prev + fitnesses[i] / sum);
        prev = successRate[i];
    }
    
    return successRate;
}

function compare(a, b)
{
    if(a < b)
        return -1;
    if(a > b)
        return 1;
    
    return 0;
}

function evaluateFitness(neuralNet)
{
    let correct = 0;
    /*
    for(let i = 0; i < 100; ++i)
    {
        let input = [];
        input.push(Math.floor(getRand(0.5, 1.5)));
        input.push(Math.floor(getRand(0.5, 1.5)));

        let expectedOutput = 0;
        if((input[0] === 0 && input[1] === 1) || (input[0] === 1 && input[1] === 0))
            expectedOutput = 1;

        neuralNet.input(input);
        if(neuralNet.outputResults[0] === expectedOutput)
            correct++;
    }
    */

    neuralNet.input([0, 0])
    if(neuralNet.outputResults[0] === 0)
        correct++;
    
    neuralNet.input([1, 0])
    if(neuralNet.outputResults[0] === 1)
        correct++;
    
    neuralNet.input([0, 1])
    if(neuralNet.outputResults[0] === 1)
        correct++;
    
    neuralNet.input([1, 1])
    if(neuralNet.outputResults[0] === 0)
        correct++;
    
    
    return correct / 4 * 100;
}

function sortNeuralNets(neuralNets, fitnesses)
{
    for(let i = 0; i < fitnesses.length - 1; ++i)
    {
        if(fitnesses[i+ 1] < fitnesses[i])
        {
            for(let j = i; j >= 0 && fitnesses[j + 1] < fitnesses[j]; --j)
            {
                let temp = fitnesses[j];
                fitnesses[j] = fitnesses[j + 1];
                fitnesses[j + 1] = temp;
                
                temp = neuralNets[j];
                neuralNets[j] = neuralNets[j + 1];
                neuralNets[j + 1] = temp;
            }
        }
    }
}

function displayResults(fitnesses)
{
    for(let i = 0; i < fitnesses.length; ++i)
    {
        print("MLP ", i, " was ", fitnesses[i], "% accurate<br>");
    }
}

let it = 0;
let j = 0;
let population = 50;
let maxGenerations = 5000;
let fitnesses = [];
let successRate = [];

let neuralNets = [];
for(let i = 0; i < population; ++i)
{
    neuralNets.push(new MLP(2, 3, 1));
}

function evaluate()
{
    if(j >= population)
    {
        clearInterval(iterate);
        iterate = setInterval(main, 0);
        sortNeuralNets(neuralNets, fitnesses);
        
        print("%CLEAR");
        print("generation: ", it, "<br>");
        displayResults(fitnesses);
        print("<br>");
        
        if(fitnesses[population - 1] >= 100)
        {
            it = 10000000;
            return;
        }
        
        successRate = getSuccessRate(fitnesses);
        neuralNets = getNextGen(neuralNets, successRate);
        fitnesses = [];
        j = 0;
        it++;
        return;
    }
    else
        fitnesses.push(evaluateFitness(neuralNets[j]));
    
    ++j;
}

function main()
{
    if(it > maxGenerations)
    {
        clearInterval(iterate);
    }
    else
    {
        clearInterval(iterate);
        iterate = setInterval(evaluate, 0);
    }
}

let iterate = setInterval(main, 0);
