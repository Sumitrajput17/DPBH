// content.js

// function handleMutations(mutationsList, observer) {
//   extractTextFromPage();
// }

// var observer = new MutationObserver(handleMutations);
// var observerConfig = { childList: true, subtree: true };
// observer.observe(document.body, observerConfig);
window.addEventListener('load', function() {
  extractTextFromPage();
  console.log("loaded")
});
async function extractTextFromPage() {
  var allElements = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');
  var extractedText = '';

  allElements.forEach(function(element) {
    if (element.textContent) {
      extractedText += element.textContent.trim() + '\n';
    }
  });
  
  extractedText = extractedText.replace(/%20/g, '')

  extractedText = extractedText.replace(/ /g, '')

  extractedText = extractedText.replace(/\n/g, '')
  extractedText = extractedText.replace(/\//g, '');
  console.log(extractedText)


  let endpoint = "http://127.0.0.1:5000/api/"

  const n = Math.ceil(extractedText.length / 80);

  const fetchDataForChunk = async (chunkIndex) => {
    const start = chunkIndex * n;
    const end = start + n;
    const chunk = extractedText.substring(start, end);

    const response = await fetch(endpoint + chunk);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };
  const fetchPromises = [];

  for (let i = 0; i < n; i++) {
    const fetchPromise = new Promise((resolve) => {
      setTimeout(async () => {
        const data = await fetchDataForChunk(i);
        resolve(data);
      }, 100 * i);
    });
    fetchPromises.push(fetchPromise);
  }

  try {
    const dataArray = await Promise.all(fetchPromises);
    dataArray.forEach((data) => {
      console.log("Result: ", JSON.stringify(data));
      if (data.dark) {
        alert("Dark pattern");
      } 
      else {
        console.log("not dark")
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }

  // fetch(endpoint + extractedText.substring(0, 50))
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   return response.json();
  // })
  // .then(data => {
  //   console.log("Result: ",JSON.stringify(data));
  //   if (data.dark)
  //   {
  //     alert("Dark pattern")
  //   }
  //   else
  //   {
  //     // alert("not dark")
  //   }
     
  // })
  // .catch(error => {
  //   console.error('Error:', error);
  // });
}
