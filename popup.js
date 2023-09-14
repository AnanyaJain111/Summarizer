document.addEventListener('DOMContentLoaded', () => {
  const summaryButton = document.getElementById('summaryButton');
  const majorPointsButton = document.getElementById('majorPointsButton');
  const responseElement = document.getElementById('response');
  const copyButtonElement = document.getElementById('copyButton');
  const errorElement = document.getElementById('error');

  summaryButton.addEventListener('click', () => {
    fetchData('summary');
  });

  majorPointsButton.addEventListener('click', () => {
    fetchData('majorPoints');
  });

  async function fetchData(choice) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    try {
      const apiKey = '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'; // Replace with your ChatGPT API key
      const contentType = await getContentType(choice, apiKey);
      const responseText = await getContentBasedOnType(contentType, choice, apiKey);
      displayData(responseText);
    } catch (error) {
      displayError(error.message);
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  async function getContentType(choice, apiKey) {
    const url = `https://gpt-summarizer-5oxqvewo.ew.gateway.dev/summary/?key=${apiKey}`;
    const task = (choice === 'summary') ? 'Summary' : 'Major Points';

    const data = {
      task: `What type of content is this - you are only allowed to answer with "article" or "email" or "other": ${task}`,
      model: 'turbo',
    };

    const response = await makeAPICall(url, data, apiKey);

    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  }

  async function getContentBasedOnType(contentType, choice, apiKey) {
    const url = `https://gpt-summarizer-5oxqvewo.ew.gateway.dev/summary/?key=${apiKey}`;
    const additionalText = (choice === 'summary') ? getSummaryText(contentType) : getMajorPointsText(contentType);

    const combinedQuestion = `${additionalText}${choice}`;

    const data = {
      task: combinedQuestion,
      model: 'turbo',
    };

    const response = await makeAPICall(url, data, apiKey);

    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  }

  function getSummaryText(contentType) {
    // Customized summary text for each content type
    // Modify as needed
    switch (contentType) {
      case 'article':
        return 'Provide me a summary of the main points from the article:\n\n';
      case 'email':
        return 'Give me a brief summary of the most significant points from the conversation:\n\n';
      case 'other':
        return 'Give me a brief summary of the web content:\n\n';
      default:
        return 'Give me a summary of the web content:\n\n';
    }
  }

  function getMajorPointsText(contentType) {
    // Customized major points text for each content type
    // Modify as needed
    switch (contentType) {
      case 'article':
        return 'Provide major points from the article:\n\n';
      case 'email':
        return 'Provide major points from the email conversation:\n\n';
      case 'other':
        return 'Provide major points from the web content:\n\n';
      default:
        return 'Provide major points from the web content:\n\n';
    }
  }

  async function getContentType(choice, apiKey) {
  const url = `https://gpt-summarizer-5oxqvewo.ew.gateway.dev/summary/?key=${apiKey}`;
  const task = (choice === 'summary') ? 'Summary' : 'Major Points';

  const data = {
    task: `What type of content is this - you are only allowed to answer with "article" or "email" or "other": ${task}`,
    model: 'turbo',
  };

  try {
    const response = await makeAPICall(url, data, apiKey);

    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}


  function displayData(data) {
    responseElement.textContent = data;
    copyButtonElement.disabled = false;
    errorElement.textContent = ''; // Clear any previous errors
  }

  function displayError(errorMessage) {
    errorElement.textContent = errorMessage;
    responseElement.textContent = ''; // Clear any previous response
    copyButtonElement.disabled = true; // Disable copy button on error
  }
});


