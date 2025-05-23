import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import FileExplorer from './components/FileExplorer';
import AIEdit from './components/AIEdit';
import './App.css';
import APIKeyModal from './components/APIKeyModal';
import ResumeUploader from './components/ResumeUploader';

// Backend URL configuration
const BACKEND_URL = 'http://localhost:5001';

// Initial file structure with HTML template
const initialFiles = [
  {
    name: "index.html",
    path: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Jake Ryan — Resume</title>
  <style>
    /* Page setup for PDF export */
    @page { size: 8.5in 11in; margin: 0; }
    body { margin: 0; padding: 0; }

    /* Resume container */
    .resume {
      box-sizing: border-box;
      width: 8.5in;
      height: 11in;
      padding: 0.5in;
      font-family: Arial, sans-serif;
      font-size: 10pt; /* Reduced font size for the resume */
      line-height: 1.1; /* Reduced line height to decrease space */
      color: #000;
    }

    /* Headings */
    h1 {
      font-size: 20pt; /* Reduced font size for the name */
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
      text-align: center;
    }
    .contact {
      text-align: center;
      margin-bottom: 8px; /* Reduced margin between name and contact */
      font-size: 10pt;
    }
    h2 {
      font-size: 14pt;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      margin: 16px 0 4px;
      padding-bottom: 2px;
    }

    /* Utility */
    .flex {
      display: flex;
      justify-content: space-between;
    }
    .subheading {
      font-weight: bold;
    }
    .subtitle {
      font-style: italic;
      font-size: 10pt;
    }
    ul {
      margin: 4px 0 0 0;
      padding-left: 16px;
    }
    li {
      margin-bottom: 4px;
    }
    .section-list > li {
      margin-bottom: 8px;
    }
    .skills p {
      margin: 2px 0;
    }
  </style>
</head>
<body>
  <div class="resume">
    <!-- Header -->
    <h1>Jake Ryan</h1>
    <p class="contact">
      123-456-7890 | 
      <a href="mailto:jake@su.edu">jake@su.edu</a> | 
      <a href="https://linkedin.com/in/jake">linkedin.com/in/jake</a> | 
      <a href="https://github.com/jake">github.com/jake</a>
    </p>

    <!-- Education -->
    <h2>Education</h2>
    <ul class="section-list">
      <li>
        <div class="flex">
          <span class="subheading">Southwestern University</span>
          <span>Aug. 2018 – May 2021</span>
        </div>
        <div class="flex">
          <span class="subtitle">Bachelor of Arts in Computer Science, Minor in Business</span>
          <span class="subtitle">Georgetown, TX</span>
        </div>
      </li>
      <li>
        <div class="flex">
          <span class="subheading">Blinn College</span>
          <span>Aug. 2014 – May 2018</span>
        </div>
        <div class="flex">
          <span class="subtitle">Associate's in Liberal Arts</span>
          <span class="subtitle">Bryan, TX</span>
        </div>
      </li>
    </ul>

    <!-- Experience -->
    <h2>Experience</h2>
    <ul class="section-list">
      <li>
        <div class="flex">
          <span class="subheading">Undergraduate Research Assistant</span>
          <span>June 2020 – Present</span>
        </div>
        <div class="flex">
          <span class="subtitle">Texas A&amp;M University</span>
          <span class="subtitle">College Station, TX</span>
        </div>
        <ul>
          <li>Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems</li>
          <li>Built a full-stack web app with Flask, React, PostgreSQL and Docker to analyze GitHub data</li>
          <li>Explored methods to visualize GitHub collaboration in a classroom setting</li>
        </ul>
      </li>
      <li>
        <div class="flex">
          <span class="subheading">Information Technology Support Specialist</span>
          <span>Sep. 2018 – Present</span>
        </div>
        <div class="flex">
          <span class="subtitle">Southwestern University</span>
          <span class="subtitle">Georgetown, TX</span>
        </div>
        <ul>
          <li>Communicate with managers to set up campus computers used across facilities</li>
          <li>Assess and troubleshoot hardware/software issues for students, faculty, and staff</li>
          <li>Maintain upkeep of computers, classroom AV equipment, and 200 printers campus-wide</li>
        </ul>
      </li>
      <li>
        <div class="flex">
          <span class="subheading">Artificial Intelligence Research Assistant</span>
          <span>May 2019 – July 2019</span>
        </div>
        <div class="flex">
          <span class="subtitle">Southwestern University</span>
          <span class="subtitle">Georgetown, TX</span>
        </div>
        <ul>
          <li>Explored methods to generate video-game dungeons inspired by <em>The Legend of Zelda</em></li>
          <li>Developed a Java game to test procedural dungeon generation techniques</li>
          <li>Contributed 50K+ lines of code to an existing codebase via Git</li>
          <li>Conducted a human-subject study on dungeon enjoyment metrics</li>
          <li>Authored an 8-page paper and presented findings on-campus and at the World Conference on Computational Intelligence</li>
        </ul>
      </li>
    </ul>

    <!-- Projects -->
    <h2>Projects</h2>
    <ul class="section-list">
      <li>
        <div class="flex">
          <span class="subheading">Gitlytics | Python, Flask, React, PostgreSQL, Docker</span>
          <span>June 2020 – Present</span>
        </div>
        <ul>
          <li>Developed a full-stack app: Flask REST API backend and React frontend</li>
          <li>Implemented GitHub OAuth to fetch user repo data</li>
          <li>Visualized collaboration metrics using interactive charts</li>
          <li>Used Celery & Redis for asynchronous data processing</li>
        </ul>
      </li>
      <li>
        <div class="flex">
          <span class="subheading">Simple Paintball | Spigot API, Java, Maven, TravisCI, Git</span>
          <span>May 2018 – May 2020</span>
        </div>
        <ul>
          <li>Built a Minecraft server plugin to entertain kids during free time</li>
          <li>Published plugin to community sites, earning 2K+ downloads (4.5/5 ★)</li>
          <li>Set up TravisCI for continuous delivery on each release</li>
          <li>Collaborated with server admins for feature requests and feedback</li>
        </ul>
      </li>
    </ul>

    <!-- Technical Skills -->
    <h2>Technical Skills</h2>
    <div class="skills">
      <p><strong>Languages:</strong> Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R</p>
      <p><strong>Frameworks:</strong> React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI</p>
      <p><strong>Developer Tools:</strong> Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse</p>
      <p><strong>Libraries:</strong> pandas, NumPy, Matplotlib</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "styles.css",
    path: "styles.css",
    content: `/* Basic styles for resume */
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
}

.resume {
    max-width: 800px;
    margin: 30px auto;
    padding: 40px;
    background-color: white;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

header {
    margin-bottom: 30px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 20px;
}

header h1 {
    margin: 0;
    color: #2c3e50;
}

section {
    margin-bottom: 25px;
}

h2 {
    color: #2c3e50;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

h3 {
    margin-bottom: 5px;
}

.company, .school {
    font-weight: bold;
}

.period {
    font-style: italic;
    color: #777;
    margin-bottom: 10px;
}

.skill-list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
}

.skill-list li {
    background-color: #f0f0f0;
    border-radius: 3px;
    padding: 5px 10px;
    margin: 0 10px 10px 0;
}`
  }
];

function App() {
  const [files, setFiles] = useState(initialFiles);
  const [currentFile, setCurrentFile] = useState(initialFiles[0]);
  const [htmlContent, setHtmlContent] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || "");
  const [aiModel, setAiModel] = useState(() => localStorage.getItem('openai_model') || "gpt-3.5-turbo-0125");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [fileToRename, setFileToRename] = useState(null);
  const renderTimeoutRef = useRef(null);
  const iframeRef = useRef(null);
  
  // AI Edit state
  const [selectedElement, setSelectedElement] = useState(null);
  const [aiEditPosition, setAiEditPosition] = useState({ x: 0, y: 0 });
  const [showAiEdit, setShowAiEdit] = useState(false);

  // Resume Uploader state
  const [isResumeUploaderOpen, setIsResumeUploaderOpen] = useState(false);

  const handleFileSelect = (file) => {
    setCurrentFile(file);
  };

  const handleFileAdd = (type) => {
    let newFileName, newContent = '';
    
    if (type === 'file') {
      const extension = currentFile.path.endsWith('.css') ? '.css' : '.html';
      newFileName = `untitled_${files.length}${extension}`;
      
      if (extension === '.html') {
        newContent = `<!DOCTYPE html>
<html>
<head>
    <title>New Page</title>
</head>
<body>
    <h1>New Page</h1>
</body>
</html>`;
      } else if (extension === '.css') {
        newContent = `/* Styles for the new file */
body {
    font-family: Arial, sans-serif;
}`;
      }
    } else {
      newFileName = 'new_folder';
    }
    
    const newFile = {
      name: newFileName,
      path: newFileName,
      content: newContent,
      type: type === 'file' ? 'file' : 'folder',
      children: type === 'folder' ? [] : undefined,
    };

    setFiles(prev => [...prev, newFile]);
    if (type === 'file') {
      setCurrentFile(newFile);
      setFileToRename(newFileName);
    }
  };

  const handleFileDelete = (file) => {
    setFiles(files.filter(f => f.path !== file.path));
    if (currentFile.path === file.path) {
      setCurrentFile(files[0]);
    }
  };

  const handleFileRename = (file, newName) => {
    const updatedFiles = files.map(f => {
      if (f.path === file.path) {
        return { ...f, name: newName, path: newName };
      }
      return f;
    });
    setFiles(updatedFiles);
    if (currentFile.path === file.path) {
      setCurrentFile({ ...currentFile, name: newName, path: newName });
    }
  };

  const handleEditorChange = (value) => {
    const updatedFiles = files.map(f => {
      if (f.path === currentFile.path) {
        return { ...f, content: value };
      }
      return f;
    });
    setFiles(updatedFiles);
    setCurrentFile({ ...currentFile, content: value });
    
    // Auto-render on content change (with debounce)
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    renderTimeoutRef.current = setTimeout(() => {
      renderHtml();
    }, 1000);
  };

  const renderHtml = async () => {
    setIsRendering(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/render`, {
        files: files,
        mainFile: 'index.html'
      });

      // Selection script for AI editing functionality
      const selectionScript = `
      <script>
        document.addEventListener('mouseup', function(e) {
          const selection = window.getSelection();
          if (!selection.isCollapsed) {
            // Get selected element
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            if (!range) return;
            
            // Get element, handling text nodes by getting parent
            let element = range.commonAncestorContainer;
            if (element.nodeType === 3) element = element.parentElement;
            
            // If element is body or invalid, try to get a more specific element
            if (!element || element.tagName === 'BODY') {
              const selectedNode = range.startContainer;
              element = selectedNode.nodeType === 3 ? selectedNode.parentElement : selectedNode;
            }
            
            if (!element || !element.tagName) return;
            
            // Send element info to parent
            const rect = element.getBoundingClientRect();
            window.parent.postMessage({
              type: 'elementSelected',
              element: {
                tagName: element.tagName,
                id: element.id || '',
                className: element.className || '',
                textContent: element.textContent ? 
                  (element.textContent.length > 50 ? 
                    element.textContent.substring(0, 50) + '...' : 
                    element.textContent) : 
                  '',
                html: element.outerHTML || ''
              },
              position: {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
              }
            }, '*');
          }
        });
      </script>`;
      
      // Process CSS files
      const cssFiles = response.data.css_files || {};
      const inlineStyles = Object.entries(cssFiles)
        .map(([path, content]) => `<style data-source="${path}">${content}</style>`)
        .join('');
      
      // Add CSS and script to HTML
      let html = response.data.html;
      if (inlineStyles) {
        html = html.replace('</head>', `${inlineStyles}</head>`);
      }
      html = html.replace('</body>', `${selectionScript}</body>`);
      
      setHtmlContent(html);
    } catch (err) {
      console.error('Render error:', err);
      setError('Failed to render HTML. Check your code for errors.');
    } finally {
      setIsRendering(false);
    }
  };

  const exportPdf = async () => {
    try {
      setIsRendering(true);
      setError(null);
      
      // Check WeasyPrint availability
      const statusResponse = await axios.get(`${BACKEND_URL}/weasyprint-status`);
      if (!statusResponse.data.available) {
        setError('PDF export not available: WeasyPrint is not properly installed on the server.');
        return;
      }
      
      // Generate PDF
      const response = await axios.post(
        `${BACKEND_URL}/export-pdf`, 
        { files, mainFile: 'index.html' }, 
        { responseType: 'blob', validateStatus: status => status < 600 }
      );
      
      // Handle non-PDF responses (errors)
      if (response.headers['content-type'] === 'application/json') {
        const text = await response.data.text();
        const errorJson = JSON.parse(text);
        setError(`PDF export failed: ${errorJson.error || 'Server error'}`);
        return;
      }
      
      if (response.status !== 200) {
        setError(`PDF export failed: Server returned status ${response.status}`);
        return;
      }
      
      // Download the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('PDF export error:', err);
      setError(`PDF export failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsRendering(false);
    }
  };

  const storeAPIKey = () => {
    setShowModal(true);
  };

  const testWeasyPrint = async () => {
    try {
      setIsRendering(true);
      setError(null);
      
      const response = await axios.get(`${BACKEND_URL}/test-weasyprint`);
      
      if (response.data.status === 'success') {
        alert(`WeasyPrint is working correctly! PDF size: ${response.data.pdf_size} bytes`);
      } else {
        setError(`WeasyPrint test failed: ${response.data.error || 'Unknown error'}`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(`WeasyPrint test failed: ${err.response.data.error || err.response.data.details || 'Server error'}`);
      } else {
        setError('WeasyPrint test failed. Check the console for details.');
      }
    } finally {
      setIsRendering(false);
    }
  };

  // Render on first load and when files change
  useEffect(() => {
    renderHtml();
    
    // Cleanup function to clear any pending timeouts
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);
  
  // Auto-render when switching files
  useEffect(() => {
    renderHtml();
  }, [currentFile.path]);

  // Auto-render preview when any file content changes (e.g. after an AI/Edit update)
  useEffect(() => {
    renderHtml();
  }, [files]);

  // Handle AI edits
  const handleAiEditUpdate = (updatedFiles) => {
    setFiles(updatedFiles);
    
    // Find and update the current file if it was changed
    const updatedCurrentFile = updatedFiles.find(f => f.path === currentFile.path);
    if (updatedCurrentFile) {
      setCurrentFile(updatedCurrentFile);
    }
  };

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'elementSelected') {
        // Store the selected element data
        setSelectedElement(event.data.element);
        
        // Calculate position for the AI Edit box
        // Get the iframe position
        const iframe = iframeRef.current;
        if (iframe) {
          const iframeRect = iframe.getBoundingClientRect();
          
          setAiEditPosition({
            x: iframeRect.left + event.data.position.x,
            y: iframeRect.top + event.data.position.y
          });
          
          setShowAiEdit(true);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Determine the language for the Monaco editor based on file extension
  const getEditorLanguage = () => {
    if (currentFile.path.endsWith('.html')) return 'html';
    if (currentFile.path.endsWith('.css')) return 'css';
    if (currentFile.path.endsWith('.js')) return 'javascript';
    return 'plaintext';
  };

  // Handle resume upload
  const handleResumeUpload = () => {
    if (!apiKey) {
      setShowModal(true);
    } else {
      setIsResumeUploaderOpen(true);
    }
  };

  return (
    <>
      <div className="app">
        <header>
          <h1>HTML Resume Editor</h1>
          <button
            onClick={storeAPIKey}
            className={`api-key-button ${apiKey ? 'api-key-set' : ''}`}
          >
            {apiKey ? "✓ API Key Set" : "Add API Key"}
          </button>
          <button
            onClick={renderHtml}
            disabled={isRendering}
            className="render-button"
          >
            {isRendering ? 'Rendering...' : 'Preview'}
          </button>
          <button
            onClick={exportPdf}
            className="export-button"
          >
            Export to PDF
          </button>
          <button
            onClick={testWeasyPrint}
            className="test-button"
          >
            Test WeasyPrint
          </button>
          <button
            onClick={handleResumeUpload}
            className="toolbar-button"
            title="Upload Resume"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 1 0V6.707l1.146 1.147a.5.5 0 0 0 .708-.708z"/>
            </svg>
            Upload Resume
          </button>
        </header>

        <main>
          <FileExplorer
            files={files}
            currentFile={currentFile}
            onFileSelect={handleFileSelect}
            onCreateFile={handleFileAdd}
            onDeleteFile={handleFileDelete}
            onRenameFile={handleFileRename}
          />

          <div className="editor-pane">
            <Editor
              height="90vh"
              defaultLanguage={getEditorLanguage()}
              language={getEditorLanguage()}
              value={currentFile.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
              }}
            />
          </div>

          <div className="preview-pane">
            {error && <div className="error-message">{error}</div>}

            {htmlContent && (
              <>
                <div className="ai-edit-instructions">
                  <div className="ai-edit-tooltip">
                    <span className="ai-edit-tooltip-icon">ℹ️</span>
                    <div className="ai-edit-tooltip-text">
                      Select any text or element to access AI edit. Type your instruction, like "make it bold" or "change text color to blue".
                    </div>
                  </div>
                </div>
                <iframe 
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  title="Resume Preview"
                  width="100%"
                  height="100%"
                  sandbox="allow-same-origin allow-scripts"
                />
              </>
            )}

            {isRendering && <div className="loading">Rendering your HTML...</div>}
            
            {showAiEdit && (
              <AIEdit
                position={aiEditPosition}
                selectedElement={selectedElement}
                onClose={() => setShowAiEdit(false)}
                apiKey={apiKey}
                aiModel={aiModel}
                targetPath={currentFile.path}
                files={files}
                onUpdate={handleAiEditUpdate}
              />
            )}
          </div>
        </main>
      </div>

      <APIKeyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={(key, model) => {
          setApiKey(key);
          setAiModel(model);
          localStorage.setItem('openai_api_key', key);
          setShowModal(false);
        }}
        initialValue={apiKey}
      />

      {isResumeUploaderOpen && (
        <ResumeUploader
          files={files}
          apiKey={apiKey}
          aiModel={aiModel}
          onUpdate={handleAiEditUpdate}
          onClose={() => setIsResumeUploaderOpen(false)}
        />
      )}
    </>
  );
}

export default App;
