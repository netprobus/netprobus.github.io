import regeneratorRuntime from "regenerator-runtime";

export function formatGraphUrl(node, dataset, datetimeRange){
  return `https://us-central1-netprobeme.cloudfunctions.net/getNetprobeData?nodeId=${node}&dataset=${dataset}&start=${datetimeRange.start.getTime()}&end=${datetimeRange.end.getTime()}`;
}

export function retrieveData(url, caller, callback){
  // console.log(`Retrieving data from: ${url}...`);
  return fetch(url)
  .then(response => {
    // console.log(`${response.status} for ${url}`);
    if(response.status >= 400){
      throw new Error(response.status + " " + response.body);
    }

    return response.json();
  })
  .then(json =>{
    // console.log(`Firing callback from retrieval of ${url}`);
    return callback(json);
  })
  .catch(error =>{
    console.log(error);
    caller.setState({
      feedback: "Error loading data from: " + url + "\nError was: " + error,
      isLoading: false
    });
  });
}
