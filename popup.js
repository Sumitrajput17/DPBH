let endpoint = "http://127.0.0.1:5000/api/"

let myFunction = function () {
  let content = document.getElementById("test-input").value
  fetch(endpoint + content)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Response:', data);
      document.getElementById('response-container').textContent = JSON.stringify(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
document.getElementById("changeColorButton").onclick = myFunction
