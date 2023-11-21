class NeuralNetwork {
  
  constructor(a, b, c, d) {
    
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.inputNodes = b;
      this.hiddenNodes = c;
      this.outputNodes = d;
    } else {
      this.inputNodes = a;
      this.hiddenNodes = b;
      this.outputNodes = c;
      this.model = this.createModel();
    }
  }
  
  createModel() {
    const model = tf.sequential();
    
    const hidden = tf.layers.dense({
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: 'sigmoid'
    });
    
    model.add(hidden);
    
    const output = tf.layers.dense({
      units: this.outputNodes,
      activation: 'softmax'  // makes sure the values add up to 1
    });
    
    model.add(output);
    //this.model.compile({});
    
    return model
  }
  
  predict(inputs) {
    
    const xs = tf.tensor2d([inputs]);
    const ys = this.model.predict(xs);
    const outputs = ys.dataSync();
    xs.dispose();
    ys.dispose();
    return outputs;
  }
  
  copy() {
    const modelCopy = this.createModel();
    const weights = this.model.getWeights();
    const weightCopies = [];
    for (let i = 0; i < weights.length; i++) {
      weightCopies[i] = weights[i].clone();
    }
    modelCopy.setWeights(weightCopies);
    return new NeuralNetwork(modelCopy, this.inputNodes, this.hiddenNodes, this.outputNodes);
  }
  
  mutate(mutationRate) {
    const weights = this.model.getWeights();
    const mutatedWeights = [];
    
    for (let i = 0; i < weights.length; i++) {
      let tensor = weights[i];
      let shape = weights[i].shape;
      let values = tensor.dataSync().slice();
      
      for (let j = 0; j < values.length; j++) {
        if (random(1) < mutationRate) {
          let w = values[j];
          values[j] = w + randomGaussian();  
        }
      }
      
      let newTensor = tf.tensor(values, shape);
      mutatedWeights[i] = newTensor;
    }
    
    this.model.setWeights(mutatedWeights);
  }
  
}