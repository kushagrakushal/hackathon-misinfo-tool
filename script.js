const contentInput = document.getElementById('contentInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultsSection = document.getElementById('resultsSection');
        const loader = document.getElementById('loader');
        const resultsOutput = document.getElementById('resultsOutput');

        // --- Configuration ---
        const N8N_WEBHOOK_URL = 'https://cors-anywhere.herokuapp.com/https://doraemonchan.app.n8n.cloud/webhook/a8f3c1f-4d9-4f7-8c-1e2a8b9c4d'; 
        // -------------------

        analyzeBtn.addEventListener('click', analyzeContent);

        async function analyzeContent() {
            const content = contentInput.value.trim();
            if (!content) {
                alert('Please enter a URL or text to analyze.');
                return;
            }
             if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE') {
                alert('Please configure the n8n webhook URL in the HTML file first.');
                return;
            }


            resultsSection.classList.remove('hidden');
            loader.classList.remove('hidden');
            resultsOutput.innerHTML = '';
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = 'Analyzing...';

            // Simple URL detection
            const isUrl = content.startsWith('http://') || content.startsWith('https://');

            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: content,
                        inputType: isUrl ? 'url' : 'text'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                
                displayResults(data);

            } catch (error) {
                console.error('Error during analysis:', error);
                resultsOutput.innerHTML = `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                                               <p class="font-bold">An Error Occurred</p>
                                               <p>${error.message}. Please check the browser console and your n8n workflow for more details.</p>
                                           </div>`;
            } finally {
                loader.classList.add('hidden');
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = 'Analyze Content';
            }
        }

        function displayResults(data) {
            let analysisHtml = '';
            if (data.analysis && data.analysis.text) {
                analysisHtml = marked.parse(data.analysis.text);
            } else {
                 analysisHtml = `<p>The AI analysis could not be completed. The response from the workflow was empty.</p>`;
            }

            let educationHtml = '';
            if (data.education && data.education.education) {
                 educationHtml = marked.parse(data.education.education);
            }

            resultsOutput.innerHTML = `
                <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
                     <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Analysis Report</h2>
                     ${analysisHtml}
                </div>
                <div class="bg-indigo-50 p-6 md:p-8 rounded-2xl border border-indigo-200">
                    ${educationHtml}
                </div>
            `;
        }