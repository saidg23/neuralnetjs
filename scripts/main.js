let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");

//function update()
//{   
//}

function getRand(min = 0, max = 1)
{
    return min + (Math.random() * max);
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
                let weight = Math.random();
                this.hiddenL[i].push(weight);
                this.chromosome.push(weight);
            }
        }
        
        for(let i = 0; i < nOutputs; ++i)
        {
            this.outputL.push([]);
            for(let j = 0; j <= nHidden; ++j)
            {
                let weight = Math.random();
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

    this.HiddenActivationFunc = function(val)
    {
        return Math.tanh(val);
    }

    this.outputActivationFunc = function(val)
    {
        return val;
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
            hiddenLResults.push(HiddenActivationFunc(netInput));
        }
               
        for(let i = 0; i < this.nOutputs; ++i)
        {
            let netInput = 0
            for(let j = 0; j < hiddenLResults.length; ++j)
            {
                netInput += this.outputL[i][j] * hiddenLResults[j];
            }

            netInput += this.outputL[i][this.nHidden];
            this.outputResults.push(outputActivationFunc(netInput));
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

function getNextGen(netList, successRate)
{
    let nInputs = netList[0].nInputs;
    let nHidden = netList[0].nHidden;
    let nOutputs = netList[0].nOutputs;
    let newGen = [];

    for(let i = 0; i < netList.length; ++i)
    {
        let parent1 = getRand();
        let patent2 = getRand();

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

        let childChromosome = breed(chromosome1, chromosome2);
        newGen.push(new MLP(nInputs, nHidden, nOutputs, childChromosome));
    }

    return newGen;
}

function getSuccessRate(fitnesses)
{
    let successRate = [];
    prevRate = 0;
    for(let i = 0; i < fitnesses.length; ++i)
    {
        successRate.push(prevRate + fitnesses[i]);
    }
}

function compare(a, b)
{
    if(a < b)
        return -1;
    if(a > b)
        return 1;
    
    return 0;
}

let populatin = 10;

let neuralNets = [];

//window.requestAnimationFrame(update);
