let canvas = document.getElementById("canvas");
let buffer = canvas.getContext("2d");

//function update()
//{   
//}

function getRand(min, max)
{
    return min + (Math.random() * max);
}

function MLP(nInputs, nHidden, nOutputs, genes = null)
{
    this.nInputs = nInputs;
    this.nHidden = nHidden;
    this.nOutputs = nOutputs;
    this.hiddenL = [];
    this.outputL =[];
    this.genes = [];
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
                this.genes.push(weight);
            }
        }
        
        for(let i = 0; i < nOutputs; ++i)
        {
            this.outputL.push([]);
            for(let j = 0; j <= nHidden; ++j)
            {
                let weight = Math.random();
                this.outputL[i].push(weight);
                this.genes.push(weight);
            }
        }
    }

    this.geneConstructor = function(genes)
    {
        let arrayPos = 0;
        for(let i = 0; i < nHidden; ++i)
        {
            this.hiddenL.push([]);
            for(let j = 0; j <= nInputs; ++j)
            {
                this.hiddenL[i].push(genes[arrayPos]);
                this.genes.push(genes[arrayPos]);
                arrayPos++;
            }
        }
        
        for(let i = 0; i < nOutputs; ++i)
        {
            this.outputL.push([]);
            for(let j = 0; j <= nHidden; ++j)
            {
                this.outputL[i].push(genes[arrayPos]);
                this.genes.push(genes[arrayPos]);
                arrayPos++;
            }
        }
    }

    if(genes === null)
        this.defaultConstructor();
    else
        this.geneConstructor(genes);

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

    this.geGenes = function()
    {
        let copy = [];
        for(let i = 0; i < this.genes.length; ++i)
        {
            copy.push(this.genes[i]);
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

//window.requestAnimationFrame(update);
