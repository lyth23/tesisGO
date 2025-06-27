// Global Variables
let currentPhase = 1
const totalPhases = 5
let selectedMethod = ""
let citationStyle = "apa"
const projectData = {
  tema: "",
  problema: "",
  justificacion: "",
  objetivoGeneral: "",
  objetivosEspecificos: "",
  hipotesis: "",
  metodologia: "",
  poblacion: "",
  citas: "",
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadSavedData()
})

// App Initialization
function initializeApp() {
  // Show loading screen for 3 seconds
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    const mainApp = document.getElementById("main-app")

    loadingScreen.style.opacity = "0"
    loadingScreen.style.visibility = "hidden"

    setTimeout(() => {
      loadingScreen.style.display = "none"
      mainApp.classList.remove("hidden")
    }, 800)

    // Initialize first phase
    showPhase(1)
    updateProgress()
    setupCharacterCounters()

    // Load theme
    const savedTheme = localStorage.getItem("tesisgo-theme") || "light"
    setTheme(savedTheme)
  }, 3000)
}

// Event Listeners Setup
function setupEventListeners() {
  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme)

  // AI assistant
  document.getElementById("ai-assistant").addEventListener("click", toggleAIPanel)
  document.getElementById("close-ai").addEventListener("click", closeAIPanel)

  // File upload
  document.getElementById("file-input").addEventListener("change", handleFileUpload)

  // Auto-save setup
  setupAutoSave()

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts)

  // Click outside AI panel to close
  document.addEventListener("click", (e) => {
    const aiPanel = document.getElementById("ai-panel")
    const aiButton = document.getElementById("ai-assistant")

    if (!aiPanel.contains(e.target) && !aiButton.contains(e.target)) {
      closeAIPanel()
    }
  })
}

// Show Phase
function showPhase(phaseNumber) {
  // Hide all phases
  document.querySelectorAll(".phase").forEach((phase) => {
    phase.classList.remove("active")
  })

  // Show current phase
  const currentPhaseElement = document.getElementById(`phase-${phaseNumber}`)
  if (currentPhaseElement) {
    currentPhaseElement.classList.add("active")
  }

  // Update progress steps
  document.querySelectorAll(".step").forEach((step, index) => {
    const stepNumber = index + 1
    step.classList.remove("active", "completed")

    if (stepNumber < phaseNumber) {
      step.classList.add("completed")
    } else if (stepNumber === phaseNumber) {
      step.classList.add("active")
    }
  })

  currentPhase = phaseNumber
  updateProgress()
  updateNavigationButtons()

  // Generate phase-specific AI suggestions
  generatePhaseSpecificSuggestions(phaseNumber)

  // Update summary if on final phase
  if (phaseNumber === 5) {
    updateProjectSummary()
    updateStats()
  }
}

// Navigate Phase
function navigatePhase(direction) {
  const newPhase = currentPhase + direction
  if (newPhase >= 1 && newPhase <= totalPhases) {
    showPhase(newPhase)
    saveData()
  }
}

// Update Progress
function updateProgress() {
  const progressPercentage = (currentPhase / totalPhases) * 100
  const progressFill = document.querySelector(".progress-bar .progress-fill")
  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`
  }
}

// Update Navigation Buttons
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")

  prevBtn.disabled = currentPhase === 1
  nextBtn.disabled = currentPhase === totalPhases

  if (currentPhase === totalPhases) {
    nextBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar'
  } else {
    nextBtn.innerHTML = 'Siguiente <i class="fas fa-chevron-right"></i>'
  }
}

// Theme Toggle
function toggleTheme() {
  const body = document.body
  const themeIcon = document.querySelector("#theme-toggle i")

  if (body.hasAttribute("data-theme") && body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme")
    themeIcon.className = "fas fa-moon"
    localStorage.setItem("tesisgo-theme", "light")
  } else {
    body.setAttribute("data-theme", "dark")
    themeIcon.className = "fas fa-sun"
    localStorage.setItem("tesisgo-theme", "dark")
  }
}

// Set Theme
function setTheme(theme) {
  const body = document.body
  const themeIcon = document.querySelector("#theme-toggle i")

  if (theme === "dark") {
    body.setAttribute("data-theme", "dark")
    themeIcon.className = "fas fa-sun"
  } else {
    body.removeAttribute("data-theme")
    themeIcon.className = "fas fa-moon"
  }
}

// AI Panel Toggle
function toggleAIPanel() {
  const panel = document.getElementById("ai-panel")
  panel.classList.toggle("active")

  if (panel.classList.contains("active")) {
    updateAISuggestions()
  }
}

// Close AI Panel
function closeAIPanel() {
  document.getElementById("ai-panel").classList.remove("active")
}

// Generate AI Suggestions
function generateAISuggestions() {
  showToast("Generando sugerencias IA...", "info")

  // Simulate AI processing
  setTimeout(() => {
    toggleAIPanel()
    showToast("Sugerencias generadas exitosamente", "success")
  }, 2000)
}

// Generate Phase Specific Suggestions
function generatePhaseSpecificSuggestions(phase) {
  const suggestions = {
    1: [
      { icon: "fas fa-lightbulb", text: "Define tu problema de investigación de forma específica y medible" },
      { icon: "fas fa-search", text: "Investiga trabajos previos relacionados con tu tema" },
      { icon: "fas fa-target", text: "Asegúrate de que tu problema sea relevante y factible" },
    ],
    2: [
      { icon: "fas fa-bullseye", text: "Usa verbos de acción para formular objetivos claros" },
      { icon: "fas fa-list-ol", text: "Los objetivos específicos deben ser medibles y alcanzables" },
      { icon: "fas fa-flask", text: "Tu hipótesis debe ser testeable y específica" },
    ],
    3: [
      { icon: "fas fa-microscope", text: "Elige la metodología que mejor responda a tu pregunta de investigación" },
      { icon: "fas fa-users", text: "Define claramente tu población y muestra" },
      { icon: "fas fa-chart-line", text: "Considera métodos mixtos para mayor robustez" },
    ],
    4: [
      { icon: "fas fa-book", text: "Usa fuentes académicas recientes y confiables" },
      { icon: "fas fa-quote-right", text: "Mantén consistencia en el formato de citación" },
      { icon: "fas fa-link", text: "Verifica que todas las citas tengan su referencia correspondiente" },
    ],
    5: [
      { icon: "fas fa-check-circle", text: "Revisa la coherencia entre todas las secciones" },
      { icon: "fas fa-spell-check", text: "Verifica ortografía y gramática" },
      { icon: "fas fa-file-export", text: "Exporta tu trabajo en el formato requerido" },
    ],
  }

  const phaseSuggestions = suggestions[phase] || []
  updateAISuggestionsContent(phaseSuggestions)
}

// Update AI Suggestions Content
function updateAISuggestionsContent(suggestions) {
  const container = document.getElementById("ai-suggestions")

  if (suggestions.length === 0) {
    container.innerHTML = `
            <div class="suggestion-item">
                <i class="fas fa-lightbulb"></i>
                <span>Esperando tu contenido para generar sugerencias...</span>
            </div>
        `
    return
  }

  container.innerHTML = suggestions
    .map(
      (suggestion) => `
        <div class="suggestion-item" onclick="applySuggestion('${suggestion.text}')">
            <i class="${suggestion.icon}"></i>
            <span>${suggestion.text}</span>
        </div>
    `,
    )
    .join("")
}

// Update AI Suggestions
function updateAISuggestions() {
  generatePhaseSpecificSuggestions(currentPhase)
}

// Apply Suggestion
function applySuggestion(suggestionText) {
  showToast("Sugerencia aplicada", "success")

  // Show hint in current phase
  const currentPhaseElement = document.querySelector(".phase.active")
  const hintElement = currentPhaseElement.querySelector(".ai-hint")

  if (hintElement) {
    hintElement.textContent = suggestionText
    hintElement.classList.add("show")

    setTimeout(() => {
      hintElement.classList.remove("show")
    }, 5000)
  }

  closeAIPanel()
}

// Select Method
function selectMethod(method) {
  // Remove previous selection
  document.querySelectorAll(".method-card").forEach((card) => {
    card.classList.remove("selected")
  })

  // Select new method
  event.target.closest(".method-card").classList.add("selected")
  selectedMethod = method

  // Update methodology description
  const descriptions = {
    cuantitativo:
      "Enfoque cuantitativo: Utiliza métodos estadísticos y numéricos para analizar datos medibles y establecer relaciones causales.",
    cualitativo:
      "Enfoque cualitativo: Se centra en la comprensión profunda de fenómenos a través de observación, entrevistas y análisis descriptivo.",
    mixto:
      "Enfoque mixto: Combina métodos cuantitativos y cualitativos para obtener una comprensión más completa del fenómeno estudiado.",
  }

  const metodologiaField = document.getElementById("metodologia")
  if (metodologiaField && metodologiaField.value.trim() === "") {
    metodologiaField.value = descriptions[method]
    updateProjectData("metodologia", descriptions[method])
  }

  showToast(`Método ${method} seleccionado`, "success")
  saveData()
}

// Set Citation Style
function setCitationStyle(style) {
  // Remove previous selection
  document.querySelectorAll(".citation-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Select new style
  event.target.classList.add("active")
  citationStyle = style

  showToast(`Estilo ${style.toUpperCase()} seleccionado`, "success")

  // Show example
  const examples = {
    apa: "Ejemplo APA: Apellido, A. A. (Año). Título del artículo. Nombre de la revista, Volumen(Número), páginas.",
    mla: 'Ejemplo MLA: Apellido, Nombre. "Título del artículo." Nombre de la revista, vol. #, no. #, Año, pp. ##-##.',
    chicago: 'Ejemplo Chicago: Apellido, Nombre. "Título del artículo." Nombre de la revista # (Año): ##-##.',
  }

  const citasField = document.getElementById("citas")
  const hint = citasField.parentNode.querySelector(".ai-hint") || createHintElement(citasField)
  hint.textContent = examples[style]
  hint.classList.add("show")

  setTimeout(() => {
    hint.classList.remove("show")
  }, 8000)

  saveData()
}

// Create Hint Element
function createHintElement(parentField) {
  const hint = document.createElement("div")
  hint.className = "ai-hint"
  parentField.parentNode.appendChild(hint)
  return hint
}

// Handle File Upload
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (file.size > maxSize) {
    showToast("El archivo es demasiado grande (máximo 10MB)", "error")
    return
  }

  if (!allowedTypes.includes(file.type)) {
    showToast("Tipo de archivo no permitido. Solo PDF, DOC y DOCX", "error")
    return
  }

  // Show file info
  const fileInfo = document.getElementById("file-info")
  fileInfo.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-file-${getFileIcon(file.type)}" style="font-size: 2rem; color: var(--primary-purple);"></i>
                <div>
                    <h4 style="margin: 0; color: var(--text-primary);">${file.name}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">
                        Tamaño: ${formatFileSize(file.size)} | Tipo: ${file.type.split("/")[1].toUpperCase()}
                    </p>
                </div>
            </div>
            <button onclick="removeFile()" style="background: #ef4444; color: white; border: none; border-radius: 8px; padding: 0.5rem; cursor: pointer; transition: var(--transition);">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
  fileInfo.classList.remove("hidden")

  showToast("Archivo cargado exitosamente", "success")
  saveData()
}

// Get File Icon
function getFileIcon(type) {
  if (type.includes("pdf")) return "pdf"
  if (type.includes("word")) return "word"
  return "alt"
}

// Format File Size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Remove File
function removeFile() {
  document.getElementById("file-info").classList.add("hidden")
  document.getElementById("file-input").value = ""
  showToast("Archivo removido", "info")
  saveData()
}

// Setup Character Counters
function setupCharacterCounters() {
  const fields = [
    { id: "problema", counterId: "problema-count", max: 500 },
    { id: "justificacion", counterId: "justificacion-count", max: 400 },
  ]

  fields.forEach((field) => {
    const element = document.getElementById(field.id)
    const counter = document.getElementById(field.counterId)

    if (element && counter) {
      element.addEventListener("input", () => {
        const count = element.value.length
        counter.textContent = count

        if (count > field.max * 0.9) {
          counter.style.color = "#ef4444"
        } else if (count > field.max * 0.7) {
          counter.style.color = "#f59e0b"
        } else {
          counter.style.color = "var(--text-secondary)"
        }

        // Update project data
        updateProjectData(field.id, element.value)
      })
    }
  })
}

// Setup Auto Save
function setupAutoSave() {
  const fields = [
    "tema",
    "problema",
    "justificacion",
    "objetivo-general",
    "objetivos-especificos",
    "hipotesis",
    "metodologia",
    "poblacion",
    "citas",
  ]

  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (field) {
      field.addEventListener(
        "input",
        debounce(() => {
          const key = fieldId.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          updateProjectData(key, field.value)
          saveData()
        }, 1000),
      )
    }
  })
}

// Update Project Data
function updateProjectData(key, value) {
  projectData[key] = value
}

// Debounce Function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Save Data
function saveData() {
  const dataToSave = {
    ...projectData,
    selectedMethod,
    citationStyle,
    currentPhase,
    lastSaved: new Date().toISOString(),
  }

  localStorage.setItem("tesisgo-data", JSON.stringify(dataToSave))
}

// Load Saved Data
function loadSavedData() {
  const savedData = localStorage.getItem("tesisgo-data")
  if (savedData) {
    try {
      const data = JSON.parse(savedData)

      // Load project data
      Object.keys(projectData).forEach((key) => {
        if (data[key]) {
          projectData[key] = data[key]
          const fieldId = key.replace(/([A-Z])/g, "-$1").toLowerCase()
          const field = document.getElementById(fieldId)
          if (field) {
            field.value = data[key]
          }
        }
      })

      // Load other settings
      selectedMethod = data.selectedMethod || ""
      citationStyle = data.citationStyle || "apa"

      // Restore UI state
      if (selectedMethod) {
        const methodCard = document.querySelector(`[onclick="selectMethod('${selectedMethod}')"]`)
        if (methodCard) methodCard.classList.add("selected")
      }

      if (citationStyle) {
        const citationBtn = document.querySelector(`[onclick="setCitationStyle('${citationStyle}')"]`)
        if (citationBtn) citationBtn.classList.add("active")
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }
}

// Update Project Summary
function updateProjectSummary() {
  const summary = `
<div style="line-height: 1.6; color: var(--text-primary);">
    <div style="margin-bottom: 1rem;">
        <strong style="color: var(--primary-purple);">📌 TEMA DE INVESTIGACIÓN</strong><br>
        ${projectData.tema || "No especificado"}
    </div>
    
    <div style="margin-bottom: 1rem;">
        <strong style="color: var(--primary-purple);">❓ PROBLEMA DE INVESTIGACIÓN</strong><br>
        ${projectData.problema ? projectData.problema.substring(0, 200) + "..." : "No especificado"}
    </div>
    
    <div style="margin-bottom: 1rem;">
        <strong style="color: var(--primary-purple);">🎯 OBJETIVO GENERAL</strong><br>
        ${projectData.objetivoGeneral ? projectData.objetivoGeneral.substring(0, 150) + "..." : "No especificado"}
    </div>
    
    <div style="margin-bottom: 1rem;">
        <strong style="color: var(--primary-purple);">🧪 METODOLOGÍA</strong><br>
        ${selectedMethod ? selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1) : "No seleccionada"}
    </div>
    
    <div style="margin-bottom: 1rem;">
        <strong style="color: var(--primary-purple);">📚 ESTILO DE CITACIÓN</strong><br>
        ${citationStyle.toUpperCase()}
    </div>
    
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 1.5rem;">
        Última actualización: ${new Date().toLocaleString()}
    </div>
</div>
    `

  document.getElementById("project-summary").innerHTML = summary
}

// Update Stats
function updateStats() {
  // Word count
  const allText = Object.values(projectData).join(" ")
  const wordCount = allText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  document.getElementById("word-count").textContent = wordCount

  // Completion percentage
  const requiredFields = ["tema", "problema", "objetivoGeneral", "metodologia"]
  const completedFields = requiredFields.filter((field) => projectData[field] && projectData[field].trim().length > 0)
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100)
  document.getElementById("completion-percentage").textContent = completionPercentage + "%"

  // Quality score (simulated)
  let qualityScore = 0
  if (projectData.tema && projectData.tema.length > 20) qualityScore += 20
  if (projectData.problema && projectData.problema.length > 100) qualityScore += 25
  if (projectData.objetivoGeneral && projectData.objetivoGeneral.length > 50) qualityScore += 20
  if (projectData.hipotesis && projectData.hipotesis.length > 30) qualityScore += 15
  if (projectData.metodologia && projectData.metodologia.length > 80) qualityScore += 20

  document.getElementById("quality-score").textContent = Math.min(qualityScore, 100)
}

// Export PDF
function exportPDF() {
  showToast("Generando PDF...", "info")

  try {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    // Configure fonts and colors
    doc.setFont("helvetica")

    // Cover page
    doc.setFontSize(24)
    doc.setTextColor(139, 92, 246)
    doc.text("TesisGO AI", 105, 30, { align: "center" })

    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text("Proyecto de Investigación", 105, 45, { align: "center" })

    doc.setFontSize(16)
    doc.text(projectData.tema || "Título no especificado", 105, 60, { align: "center" })

    // Project info
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 280, { align: "center" })
    doc.text("Powered by TesisGO AI", 105, 285, { align: "center" })

    // New page for content
    doc.addPage()

    let yPosition = 20
    const lineHeight = 7
    const pageHeight = 280

    // Function to add section
    function addSection(title, content, icon = "") {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }

      // Section title
      doc.setFontSize(14)
      doc.setTextColor(139, 92, 246)
      doc.text(`${icon} ${title}`, 20, yPosition)
      yPosition += lineHeight + 3

      // Content
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)

      if (content && content.trim()) {
        const lines = doc.splitTextToSize(content, 170)
        lines.forEach((line) => {
          if (yPosition > pageHeight - 10) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 20, yPosition)
          yPosition += lineHeight
        })
      } else {
        doc.setTextColor(150, 150, 150)
        doc.text("No especificado", 20, yPosition)
        yPosition += lineHeight
      }

      yPosition += 5 // Space between sections
    }

    // Add sections
    addSection("PROBLEMA DE INVESTIGACIÓN", projectData.problema, "❓")
    addSection("JUSTIFICACIÓN", projectData.justificacion, "✅")
    addSection("OBJETIVO GENERAL", projectData.objetivoGeneral, "🎯")
    addSection("OBJETIVOS ESPECÍFICOS", projectData.objetivosEspecificos, "📋")
    addSection("HIPÓTESIS", projectData.hipotesis, "💡")
    addSection("METODOLOGÍA", projectData.metodologia, "🧪")
    addSection("POBLACIÓN Y MUESTRA", projectData.poblacion, "👥")
    addSection("REFERENCIAS BIBLIOGRÁFICAS", projectData.citas, "📚")

    // Additional info
    if (yPosition > pageHeight - 50) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(12)
    doc.setTextColor(139, 92, 246)
    doc.text("INFORMACIÓN ADICIONAL", 20, yPosition)
    yPosition += lineHeight + 3

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(`Método de investigación: ${selectedMethod || "No seleccionado"}`, 20, yPosition)
    yPosition += lineHeight
    doc.text(`Estilo de citación: ${citationStyle.toUpperCase()}`, 20, yPosition)
    yPosition += lineHeight
    doc.text(`Palabras totales: ${document.getElementById("word-count").textContent}`, 20, yPosition)
    yPosition += lineHeight
    doc.text(`Completitud: ${document.getElementById("completion-percentage").textContent}`, 20, yPosition)

    // Save PDF
    const fileName = `TesisGO_${projectData.tema ? projectData.tema.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "_") : "Proyecto"}_${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)

    showToast("PDF exportado exitosamente", "success")
  } catch (error) {
    console.error("Error exporting PDF:", error)
    showToast("Error al exportar PDF", "error")
  }
}

// Export Word
function exportWord() {
  showToast("Generando documento Word...", "info")

  const content = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>TesisGO - ${projectData.tema || "Proyecto de Investigación"}</title>
            <style>
                body { 
                    font-family: 'Times New Roman', serif; 
                    line-height: 1.6; 
                    margin: 2cm; 
                    color: #333;
                }
                h1 { 
                    color: #8B5CF6; 
                    text-align: center; 
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                h2 { 
                    color: #6D28D9; 
                    border-bottom: 2px solid #8B5CF6; 
                    padding-bottom: 5px; 
                    font-size: 18px;
                    margin-top: 30px;
                }
                .section { 
                    margin-bottom: 2em; 
                }
                .metadata { 
                    background: #f5f5f5; 
                    padding: 1em; 
                    border-left: 4px solid #8B5CF6; 
                    margin-top: 30px;
                }
                p { 
                    text-align: justify; 
                    margin-bottom: 12px;
                }
                .subtitle {
                    text-align: center;
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 30px;
                }
            </style>
        </head>
        <body>
            <h1>TesisGO AI - Proyecto de Investigación</h1>
            <div class="subtitle">${projectData.tema || "Título del Proyecto"}</div>
            
            <div class="section">
                <h2>1. Planteamiento del Problema</h2>
                <p><strong>Problema:</strong></p>
                <p>${projectData.problema || "No especificado"}</p>
                
                <p><strong>Justificación:</strong></p>
                <p>${projectData.justificacion || "No especificado"}</p>
            </div>
            
            <div class="section">
                <h2>2. Objetivos</h2>
                <p><strong>Objetivo General:</strong></p>
                <p>${projectData.objetivoGeneral || "No especificado"}</p>
                
                <p><strong>Objetivos Específicos:</strong></p>
                <p>${projectData.objetivosEspecificos || "No especificado"}</p>
            </div>
            
            <div class="section">
                <h2>3. Hipótesis</h2>
                <p>${projectData.hipotesis || "No especificado"}</p>
            </div>
            
            <div class="section">
                <h2>4. Metodología</h2>
                <p>${projectData.metodologia || "No especificado"}</p>
                
                <p><strong>Población y Muestra:</strong></p>
                <p>${projectData.poblacion || "No especificado"}</p>
            </div>
            
            <div class="section">
                <h2>5. Referencias Bibliográficas</h2>
                <p>${projectData.citas || "No especificado"}</p>
            </div>
            
            <div class="metadata">
                <h3>Información del Proyecto</h3>
                <p><strong>Método:</strong> ${selectedMethod || "No seleccionado"}</p>
                <p><strong>Estilo de citación:</strong> ${citationStyle.toUpperCase()}</p>
                <p><strong>Generado:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Powered by:</strong> TesisGO AI</p>
            </div>
        </body>
        </html>
    `

  // Create and download file
  const blob = new Blob([content], { type: "application/msword" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `TesisGO_${projectData.tema ? projectData.tema.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "_") : "Proyecto"}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showToast("Documento Word exportado", "success")
}

// Share Project
function shareProject() {
  if (navigator.share) {
    navigator
      .share({
        title: "TesisGO - Mi Proyecto de Investigación",
        text: `Revisa mi proyecto: ${projectData.tema || "Proyecto de Investigación"}`,
        url: window.location.href,
      })
      .then(() => {
        showToast("Proyecto compartido", "success")
      })
      .catch(() => {
        fallbackShare()
      })
  } else {
    fallbackShare()
  }
}

// Fallback Share
function fallbackShare() {
  const shareData = {
    title: projectData.tema || "Proyecto de Investigación",
    summary: projectData.problema
      ? projectData.problema.substring(0, 200) + "..."
      : "Proyecto desarrollado con TesisGO AI",
    url: window.location.href,
  }

  const shareText = `${shareData.title}\n\n${shareData.summary}\n\nDesarrollado con TesisGO AI`

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast("Información copiada al portapapeles", "success")
    })
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = shareText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    showToast("Información copiada al portapapeles", "success")
  }
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + S to save
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault()
    saveData()
    showToast("Proyecto guardado", "success")
  }

  // Ctrl/Cmd + Left Arrow to go back
  if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft") {
    e.preventDefault()
    navigatePhase(-1)
  }

  // Ctrl/Cmd + Right Arrow to go forward
  if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight") {
    e.preventDefault()
    navigatePhase(1)
  }

  // Escape to close AI panel
  if (e.key === "Escape") {
    closeAIPanel()
  }
}

// Show Toast Notification
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container")

  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto; padding: 0.25rem;">
            <i class="fas fa-times"></i>
        </button>
    `

  container.appendChild(toast)

  // Auto remove
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "slideOutRight 0.3s ease-in"
      setTimeout(() => toast.remove(), 300)
    }
  }, duration)
}

// Handle page visibility change for auto-save
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveData()
  }
})

// Handle window close
window.addEventListener("beforeunload", (e) => {
  saveData()
})

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  initializeApp()
}

console.log("TesisGO AI inicializado correctamente ✨")
