// Variables globales
let currentPhase = 1;
let totalPhases = 5;
let aiSuggestions = [];
let selectedMethod = '';
let citationStyle = 'apa';
let projectData = {};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSavedData();
});

// Inicializar aplicación
function initializeApp() {
    // Simular carga
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Mostrar primera fase
        mostrarFase('fase1', 1);
        updateProgress();
        
        // Inicializar contadores de caracteres
        setupCharacterCounters();
        
        // Configurar tema inicial
        const savedTheme = localStorage.getItem('tesisgo-theme') || 'light';
        setTheme(savedTheme);
        
    }, 2000);
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle de tema
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Asistente IA
    document.getElementById('ai-assistant').addEventListener('click', toggleAIPanel);
    document.getElementById('close-ai').addEventListener('click', closeAIPanel);
    
    // Navegación
    document.getElementById('prev-btn').addEventListener('click', () => navegarFase(-1));
    document.getElementById('next-btn').addEventListener('click', () => navegarFase(1));
    
    // Auto-guardado
    setupAutoSave();
    
    // Drag and drop para archivos
    setupFileUpload();
    
    // Validación en tiempo real
    setupRealTimeValidation();
}

// Mostrar fase específica
function mostrarFase(faseId, phaseNumber) {
    // Ocultar todas las fases
    document.querySelectorAll('.fase').forEach(fase => {
        fase.classList.remove('active');
    });
    
    // Mostrar fase actual
    const currentFase = document.getElementById(faseId);
    if (currentFase) {
        currentFase.classList.add('active');
    }
    
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[onclick="mostrarFase('${faseId}', ${phaseNumber})"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Actualizar fase actual
    currentPhase = phaseNumber;
    updateProgress();
    updateNavigationButtons();
    
    // Generar sugerencias IA para la fase actual
    generatePhaseSpecificSuggestions(phaseNumber);
    
    // Guardar progreso
    saveProgress();
}

// Navegación entre fases
function navegarFase(direction) {
    const newPhase = currentPhase + direction;
    
    if (newPhase >= 1 && newPhase <= totalPhases) {
        const faseId = `fase${newPhase}`;
        mostrarFase(faseId, newPhase);
    }
}

// Actualizar indicador de progreso
function updateProgress() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentPhase) {
            step.classList.add('completed');
        } else if (stepNumber === currentPhase) {
            step.classList.add('active');
        }
    });
}

// Actualizar botones de navegación
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentPhase === 1;
    nextBtn.disabled = currentPhase === totalPhases;
    
    if (currentPhase === totalPhases) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar';
    } else {
        nextBtn.innerHTML = 'Siguiente <i class="fas fa-chevron-right"></i>';
    }
}

// Toggle tema
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('tesisgo-theme', 'light');
    } else {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('tesisgo-theme', 'dark');
    }
}

// Establecer tema
function setTheme(theme) {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    }
}

// Toggle panel IA
function toggleAIPanel() {
    const panel = document.getElementById('ai-panel');
    panel.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
        updateAISuggestions();
    }
}

// Cerrar panel IA
function closeAIPanel() {
    document.getElementById('ai-panel').classList.remove('active');
}

// Generar sugerencias específicas por fase
function generatePhaseSpecificSuggestions(phase) {
    const suggestions = {
        1: [
            { icon: 'fas fa-lightbulb', text: 'Define tu problema de investigación de forma específica y medible' },
            { icon: 'fas fa-search', text: 'Investiga trabajos previos relacionados con tu tema' },
            { icon: 'fas fa-target', text: 'Asegúrate de que tu problema sea relevante y factible' }
        ],
        2: [
            { icon: 'fas fa-bullseye', text: 'Usa verbos de acción para formular objetivos claros' },
            { icon: 'fas fa-list-ol', text: 'Los objetivos específicos deben ser medibles y alcanzables' },
            { icon: 'fas fa-flask', text: 'Tu hipótesis debe ser testeable y específica' }
        ],
        3: [
            { icon: 'fas fa-microscope', text: 'Elige la metodología que mejor responda a tu pregunta de investigación' },
            { icon: 'fas fa-users', text: 'Define claramente tu población y muestra' },
            { icon: 'fas fa-chart-line', text: 'Considera métodos mixtos para mayor robustez' }
        ],
        4: [
            { icon: 'fas fa-book', text: 'Usa fuentes académicas recientes y confiables' },
            { icon: 'fas fa-quote-right', text: 'Mantén consistencia en el formato de citación' },
            { icon: 'fas fa-link', text: 'Verifica que todas las citas tengan su referencia correspondiente' }
        ],
        5: [
            { icon: 'fas fa-check-circle', text: 'Revisa la coherencia entre todas las secciones' },
            { icon: 'fas fa-spell-check', text: 'Verifica ortografía y gramática' },
            { icon: 'fas fa-file-export', text: 'Exporta tu trabajo en el formato requerido' }
        ]
    };
    
    aiSuggestions = suggestions[phase] || [];
}

// Actualizar sugerencias IA
function updateAISuggestions() {
    const container = document.getElementById('ai-suggestions');
    
    if (aiSuggestions.length === 0) {
        generatePhaseSpecificSuggestions(currentPhase);
    }
    
    container.innerHTML = aiSuggestions.map(suggestion => `
        <div class="suggestion-item" onclick="applySuggestion('${suggestion.text}')">
            <i class="${suggestion.icon}"></i>
            <span>${suggestion.text}</span>
        </div>
    `).join('');
}

// Aplicar sugerencia
function applySuggestion(suggestionText) {
    // Mostrar notificación
    showNotification('Sugerencia aplicada', 'success');
    
    // Agregar a hints si es relevante
    const currentFaseElement = document.querySelector('.fase.active');
    const hintElement = currentFaseElement.querySelector('.ai-hint');
    
    if (hintElement) {
        hintElement.textContent = suggestionText;
        hintElement.classList.add('show');
        
        setTimeout(() => {
            hintElement.classList.remove('show');
        }, 5000);
    }
}

// Generar sugerencias para problema
function generarSugerenciaProblema() {
    const tema = document.getElementById('tema').value;
    const problema = document.getElementById('problema').value;
    
    if (!tema.trim()) {
        showNotification('Por favor, ingresa un tema primero', 'warning');
        return;
    }
    
    // Simular procesamiento IA
    showAIProcessing();
    
    setTimeout(() => {
        const sugerencias = generateProblemSuggestions(tema, problema);
        displayAISuggestions(sugerencias);
        hideAIProcessing();
    }, 2000);
}

// Generar sugerencias para objetivos
function generarSugerenciaObjetivos() {
    const tema = document.getElementById('tema').value;
    const problema = document.getElementById('problema').value;
    
    if (!tema.trim() || !problema.trim()) {
        showNotification('Completa el tema y problema primero', 'warning');
        return;
    }
    
    showAIProcessing();
    
    setTimeout(() => {
        const sugerencias = generateObjectiveSuggestions(tema, problema);
        displayAISuggestions(sugerencias);
        hideAIProcessing();
    }, 2000);
}

// Generar sugerencias de problema (simulado)
function generateProblemSuggestions(tema, problema) {
    const templates = [
        `Considera enfocar tu investigación en los aspectos más específicos de "${tema}"`,
        `Tu problema podría beneficiarse de una delimitación temporal y geográfica más clara`,
        `Piensa en las variables dependientes e independientes de tu estudio sobre "${tema}"`,
        `¿Has considerado el impacto social o económico de este problema?`
    ];
    
    return templates.map(template => ({
        type: 'suggestion',
        content: template,
        confidence: Math.floor(Math.random() * 30) + 70
    }));
}

// Generar sugerencias de objetivos (simulado)
function generateObjectiveSuggestions(tema, problema) {
    const objetivoGeneral = `Analizar el impacto de ${tema.toLowerCase()} en el contexto específico de tu investigación`;
    const objetivosEspecificos = [
        `Identificar los factores clave relacionados con ${tema.toLowerCase()}`,
        `Evaluar la efectividad de las estrategias actuales`,
        `Proponer mejoras basadas en los hallazgos de la investigación`
    ];
    
    return [
        {
            type: 'objective',
            label: 'Objetivo General Sugerido',
            content: objetivoGeneral,
            confidence: 85
        },
        {
            type: 'objectives',
            label: 'Objetivos Específicos Sugeridos',
            content: objetivosEspecificos,
            confidence: 80
        }
    ];
}

// Mostrar sugerencias IA
function displayAISuggestions(suggestions) {
    const container = document.getElementById('ai-suggestions');
    
    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" onclick="applySuggestionContent('${suggestion.content}', '${suggestion.type}')">
            <i class="fas fa-robot"></i>
            <div>
                <strong>${suggestion.label || 'Sugerencia IA'}</strong>
                <p>${Array.isArray(suggestion.content) ? suggestion.content.join('<br>• ') : suggestion.content}</p>
                <small>Confianza: ${suggestion.confidence}%</small>
            </div>
        </div>
    `).join('');
    
    // Abrir panel IA automáticamente
    document.getElementById('ai-panel').classList.add('active');
}

// Aplicar contenido de sugerencia
function applySuggestionContent(content, type) {
    if (type === 'objective') {
        document.getElementById('objetivo-general').value = content;
    } else if (type === 'objectives') {
        document.getElementById('objetivos-especificos').value = content.split('<br>').join('\n');
    }
    
    showNotification('Sugerencia aplicada exitosamente', 'success');
    closeAIPanel();
}

// Mostrar procesamiento IA
function showAIProcessing() {
    const container = document.getElementById('ai-suggestions');
    container.innerHTML = `
        <div class="suggestion-item">
            <div class="ai-spinner">
                <div class="spinner-ring"></div>
            </div>
            <span>Analizando con IA...</span>
        </div>
    `;
}

// Ocultar procesamiento IA
function hideAIProcessing() {
    updateAISuggestions();
}

// Seleccionar método de investigación
function selectMethod(method) {
    // Remover selección anterior
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo método
    event.target.closest('.method-card').classList.add('selected');
    selectedMethod = method;
    
    // Actualizar descripción metodológica
    const descriptions = {
        'cuantitativo': 'Enfoque cuantitativo: Utiliza métodos estadísticos y numéricos para analizar datos medibles y establecer relaciones causales.',
        'cualitativo': 'Enfoque cualitativo: Se centra en la comprensión profunda de fenómenos a través de observación, entrevistas y análisis descriptivo.',
        'mixto': 'Enfoque mixto: Combina métodos cuantitativos y cualitativos para obtener una comprensión más completa del fenómeno estudiado.'
    };
    
    const metodologiaField = document.getElementById('metodologia');
    if (metodologiaField.value.trim() === '') {
        metodologiaField.value = descriptions[method];
    }
    
    showNotification(`Método ${method} seleccionado`, 'success');
}

// Establecer estilo de citación
function setCitationStyle(style) {
    // Remover selección anterior
    document.querySelectorAll('.citation-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Seleccionar nuevo estilo
    event.target.classList.add('active');
    citationStyle = style;
    
    showNotification(`Estilo ${style.toUpperCase()} seleccionado`, 'success');
    
    // Mostrar ejemplo de citación
    const examples = {
        'apa': 'Ejemplo APA: Apellido, A. A. (Año). Título del artículo. Nombre de la revista, Volumen(Número), páginas.',
        'mla': 'Ejemplo MLA: Apellido, Nombre. "Título del artículo." Nombre de la revista, vol. #, no. #, Año, pp. ##-##.',
        'chicago': 'Ejemplo Chicago: Apellido, Nombre. "Título del artículo." Nombre de la revista # (Año): ##-##.'
    };
    
    const citasField = document.getElementById('citas');
    const hint = citasField.parentNode.querySelector('.ai-hint') || createHintElement(citasField);
    hint.textContent = examples[style];
    hint.classList.add('show');
    
    setTimeout(() => {
        hint.classList.remove('show');
    }, 8000);
}

// Crear elemento de hint
function createHintElement(parentField) {
    const hint = document.createElement('div');
    hint.className = 'ai-hint';
    parentField.parentNode.appendChild(hint);
    return hint;
}

// Configurar upload de archivos
function setupFileUpload() {
    const uploadZone = document.querySelector('.upload-zone');
    const fileInput = document.getElementById('archivoTesis');
    const fileInfo = document.getElementById('file-info');
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary-purple)';
        uploadZone.style.background = 'rgba(139, 92, 246, 0.1)';
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border-color)';
        uploadZone.style.background = 'var(--bg-secondary)';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border-color)';
        uploadZone.style.background = 'var(--bg-secondary)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

// Manejar upload de archivo
function handleFileUpload(file) {
    const fileInfo = document.getElementById('file-info');
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
        showNotification('El archivo es demasiado grande (máximo 10MB)', 'error');
        return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Tipo de archivo no permitido. Solo PDF, DOC y DOCX', 'error');
        return;
    }
    
    // Mostrar información del archivo
    fileInfo.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <i class="fas fa-file-${getFileIcon(file.type)}" style="font-size: 2rem; color: var(--primary-purple);"></i>
            <div>
                <h4>${file.name}</h4>
                <p>Tamaño: ${formatFileSize(file.size)}</p>
                <p>Tipo: ${file.type}</p>
            </div>
            <button onclick="removeFile()" style="background: #ef4444; color: white; border: none; border-radius: 8px; padding: 0.5rem; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    fileInfo.classList.add('show');
    
    // Guardar archivo en localStorage (simulado)
    localStorage.setItem('tesisgo-file', JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
    }));
    
    showNotification('Archivo cargado exitosamente', 'success');
}

// Obtener icono de archivo
function getFileIcon(type) {
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word')) return 'word';
    return 'alt';
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remover archivo
function removeFile() {
    document.getElementById('file-info').classList.remove('show');
    document.getElementById('archivoTesis').value = '';
    localStorage.removeItem('tesisgo-file');
    showNotification('Archivo removido', 'info');
}

// Configurar contadores de caracteres
function setupCharacterCounters() {
    const fields = [
        { id: 'problema', counterId: 'problema-count', max: 500 },
        { id: 'justificacion', counterId: 'justificacion-count', max: 400 }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const counter = document.getElementById(field.counterId);
        
        if (element && counter) {
            element.addEventListener('input', () => {
                const count = element.value.length;
                counter.textContent = count;
                
                if (count > field.max * 0.9) {
                    counter.style.color = '#ef4444';
                } else if (count > field.max * 0.7) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = 'var(--text-secondary)';
                }
            });
        }
    });
}

// Configurar auto-guardado
function setupAutoSave() {
    const fields = ['tema', 'problema', 'justificacion', 'objetivo-general', 'objetivos-especificos', 'hipotesis', 'metodologia', 'poblacion', 'citas'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', debounce(() => {
                saveData();
                showNotification('Guardado automático', 'info', 1000);
            }, 2000));
        }
    });
}

// Configurar validación en tiempo real
function setupRealTimeValidation() {
    const requiredFields = ['tema', 'problema', 'objetivo-general'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => {
                validateField(field);
            });
        }
    });
}

// Validar campo
function validateField(field) {
    const value = field.value.trim();
    const minLength = field.id === 'tema' ? 10 : 50;
    
    // Remover clases de validación anteriores
    field.classList.remove('valid', 'invalid');
    
    if (value.length < minLength) {
        field.classList.add('invalid');
        field.style.borderColor = '#ef4444';
    } else {
        field.classList.add('valid');
        field.style.borderColor = '#10b981';
    }
    
    setTimeout(() => {
        field.style.borderColor = 'var(--border-color)';
    }, 3000);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Guardar datos
function saveData() {
    const data = {
        tema: document.getElementById('tema').value,
        problema: document.getElementById('problema').value,
        justificacion: document.getElementById('justificacion').value,
        objetivoGeneral: document.getElementById('objetivo-general').value,
        objetivosEspecificos: document.getElementById('objetivos-especificos').value,
        hipotesis: document.getElementById('hipotesis').value,
        metodologia: document.getElementById('metodologia').value,
        poblacion: document.getElementById('poblacion').value,
        citas: document.getElementById('citas').value,
        selectedMethod: selectedMethod,
        citationStyle: citationStyle,
        currentPhase: currentPhase,
        lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('tesisgo-data', JSON.stringify(data));
    projectData = data;
}

// Cargar datos guardados
function loadSavedData() {
    const savedData = localStorage.getItem('tesisgo-data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Cargar campos de texto
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (element && typeof data[key] === 'string') {
                    element.value = data[key];
                }
            });
            
            // Restaurar selecciones
            selectedMethod = data.selectedMethod || '';
            citationStyle = data.citationStyle || 'apa';
            currentPhase = data.currentPhase || 1;
            
            // Actualizar UI
            if (selectedMethod) {
                const methodCard = document.querySelector(`[onclick="selectMethod('${selectedMethod}')"]`);
                if (methodCard) methodCard.classList.add('selected');
            }
            
            if (citationStyle) {
                const citationBtn = document.querySelector(`[onclick="setCitationStyle('${citationStyle}')"]`);
                if (citationBtn) citationBtn.classList.add('active');
            }
            
            projectData = data;
            updateStats();
            
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Guardar progreso
function saveProgress() {
    const progress = {
        currentPhase: currentPhase,
        completedPhases: Array.from({length: currentPhase - 1}, (_, i) => i + 1),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('tesisgo-progress', JSON.stringify(progress));
}

// Mostrar resumen
function mostrarResumen() {
    saveData();
    const data = projectData;
    
    const resumen = `
📌 TEMA DE INVESTIGACIÓN
${data.tema || 'No especificado'}

❓ PROBLEMA DE INVESTIGACIÓN
${data.problema || 'No especificado'}

✅ JUSTIFICACIÓN
${data.justificacion || 'No especificado'}

🎯 OBJETIVO GENERAL
${data.objetivoGeneral || 'No especificado'}

📋 OBJETIVOS ESPECÍFICOS
${data.objetivosEspecificos || 'No especificado'}

💡 HIPÓTESIS
${data.hipotesis || 'No especificado'}

🧪 METODOLOGÍA
${data.metodologia || 'No especificado'}

👥 POBLACIÓN Y MUESTRA
${data.poblacion || 'No especificado'}

📚 REFERENCIAS BIBLIOGRÁFICAS
${data.citas || 'No especificado'}

📊 INFORMACIÓN ADICIONAL
Método seleccionado: ${selectedMethod || 'No seleccionado'}
Estilo de citación: ${citationStyle.toUpperCase()}
Última actualización: ${new Date().toLocaleString()}
    `;
    
    document.getElementById('resumen-datos').textContent = resumen;
    updateStats();
}

// Actualizar estadísticas
function updateStats() {
    const data = projectData;
    
    // Contar palabras
    const allText = Object.values(data).filter(v => typeof v === 'string').join(' ');
    const wordCount = allText.trim().split(/\s+/).length;
    document.getElementById('word-count').textContent = wordCount;
    
    // Calcular completitud
    const requiredFields = ['tema', 'problema', 'justificacion', 'objetivoGeneral', 'hipotesis', 'metodologia'];
    const completedFields = requiredFields.filter(field => data[field] && data[field].trim().length > 0);
    const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
    document.getElementById('completion-time').textContent = completionPercentage + '%';
    
    // Calcular puntuación de calidad (simulado)
    let qualityScore = 0;
    if (data.tema && data.tema.length > 20) qualityScore += 20;
    if (data.problema && data.problema.length > 100) qualityScore += 25;
    if (data.objetivoGeneral && data.objetivoGeneral.length > 50) qualityScore += 20;
    if (data.hipotesis && data.hipotesis.length > 30) qualityScore += 15;
    if (data.metodologia && data.metodologia.length > 80) qualityScore += 20;
    
    document.getElementById('quality-score').textContent = Math.min(qualityScore, 100);
}

// Exportar PDF mejorado
function exportarPDF() {
    saveData();
    mostrarResumen();
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración de fuentes y colores
    doc.setFont('helvetica');
    
    // Portada
    doc.setFontSize(24);
    doc.setTextColor(139, 92, 246);
    doc.text('TesisGO AI', 105, 30, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Proyecto de Investigación', 105, 45, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(projectData.tema || 'Título no especificado', 105, 60, { align: 'center' });
    
    // Información del proyecto
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });
    doc.text('Powered by TesisGO AI', 105, 285, { align: 'center' });
    
    // Nueva página para contenido
    doc.addPage();
    
    let yPosition = 20;
    const lineHeight = 7;
    const pageHeight = 280;
    
    // Función para agregar sección
    function addSection(title, content, icon = '') {
        if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Título de sección
        doc.setFontSize(14);
        doc.setTextColor(139, 92, 246);
        doc.text(`${icon} ${title}`, 20, yPosition);
        yPosition += lineHeight + 3;
        
        // Contenido
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        if (content && content.trim()) {
            const lines = doc.splitTextToSize(content, 170);
            lines.forEach(line => {
                if (yPosition > pageHeight - 10) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += lineHeight;
            });
        } else {
            doc.setTextColor(150, 150, 150);
            doc.text('No especificado', 20, yPosition);
            yPosition += lineHeight;
        }
        
        yPosition += 5; // Espacio entre secciones
    }
    
    // Agregar secciones
    addSection('PROBLEMA DE INVESTIGACIÓN', projectData.problema, '❓');
    addSection('JUSTIFICACIÓN', projectData.justificacion, '✅');
    addSection('OBJETIVO GENERAL', projectData.objetivoGeneral, '🎯');
    addSection('OBJETIVOS ESPECÍFICOS', projectData.objetivosEspecificos, '📋');
    addSection('HIPÓTESIS', projectData.hipotesis, '💡');
    addSection('METODOLOGÍA', projectData.metodologia, '🧪');
    addSection('POBLACIÓN Y MUESTRA', projectData.poblacion, '👥');
    addSection('REFERENCIAS BIBLIOGRÁFICAS', projectData.citas, '📚');
    
    // Información adicional
    if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(139, 92, 246);
    doc.text('INFORMACIÓN ADICIONAL', 20, yPosition);
    yPosition += lineHeight + 3;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Método de investigación: ${selectedMethod || 'No seleccionado'}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Estilo de citación: ${citationStyle.toUpperCase()}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Palabras totales: ${document.getElementById('word-count').textContent}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Completitud: ${document.getElementById('completion-time').textContent}`, 20, yPosition);
    
    // Guardar PDF
    const fileName = `TesisGO_${projectData.tema ? projectData.tema.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Proyecto'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    showNotification('PDF exportado exitosamente', 'success');
}

// Exportar Word (simulado)
function exportarWord() {
    saveData();
    mostrarResumen();
    
    // Crear contenido HTML para Word
    const content = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>TesisGO - ${projectData.tema || 'Proyecto de Investigación'}</title>
            <style>
                body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 2cm; }
                h1 { color: #8B5CF6; text-align: center; }
                h2 { color: #6D28D9; border-bottom: 2px solid #8B5CF6; padding-bottom: 5px; }
                .section { margin-bottom: 2em; }
                .metadata { background: #f5f5f5; padding: 1em; border-left: 4px solid #8B5CF6; }
            </style>
        </head>
        <body>
            <h1>TesisGO AI - Proyecto de Investigación</h1>
            <h2>${projectData.tema || 'Título del Proyecto'}</h2>
            
            <div class="section">
                <h2>1. Planteamiento del Problema</h2>
                <p><strong>Problema:</strong></p>
                <p>${projectData.problema || 'No especificado'}</p>
                
                <p><strong>Justificación:</strong></p>
                <p>${projectData.justificacion || 'No especificado'}</p>
            </div>
            
            <div class="section">
                <h2>2. Objetivos</h2>
                <p><strong>Objetivo General:</strong></p>
                <p>${projectData.objetivoGeneral || 'No especificado'}</p>
                
                <p><strong>Objetivos Específicos:</strong></p>
                <p>${projectData.objetivosEspecificos || 'No especificado'}</p>
            </div>
            
            <div class="section">
                <h2>3. Hipótesis</h2>
                <p>${projectData.hipotesis || 'No especificado'}</p>
            </div>
            
            <div class="section">
                <h2>4. Metodología</h2>
                <p>${projectData.metodologia || 'No especificado'}</p>
                
                <p><strong>Población y Muestra:</strong></p>
                <p>${projectData.poblacion || 'No especificado'}</p>
            </div>
            
            <div class="section">
                <h2>5. Referencias Bibliográficas</h2>
                <p>${projectData.citas || 'No especificado'}</p>
            </div>
            
            <div class="metadata">
                <h3>Información del Proyecto</h3>
                <p><strong>Método:</strong> ${selectedMethod || 'No seleccionado'}</p>
                <p><strong>Estilo de citación:</strong> ${citationStyle.toUpperCase()}</p>
                <p><strong>Generado:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Powered by:</strong> TesisGO AI</p>
            </div>
        </body>
        </html>
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TesisGO_${projectData.tema ? projectData.tema.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Proyecto'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Documento Word exportado', 'success');
}

// Compartir proyecto
function compartirProyecto() {
    if (navigator.share) {
        navigator.share({
            title: 'TesisGO - Mi Proyecto de Investigación',
            text: `Revisa mi proyecto: ${projectData.tema || 'Proyecto de Investigación'}`,
            url: window.location.href
        }).then(() => {
            showNotification('Proyecto compartido', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// Compartir alternativo
function fallbackShare() {
    const shareData = {
        title: projectData.tema || 'Proyecto de Investigación',
        summary: projectData.problema ? projectData.problema.substring(0, 200) + '...' : 'Proyecto desarrollado con TesisGO AI',
        url: window.location.href
    };
    
    const shareText = `${shareData.title}\n\n${shareData.summary}\n\nDesarrollado con TesisGO AI`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Información copiada al portapapeles', 'success');
        });
    } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Información copiada al portapapeles', 'success');
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info', duration = 3000) {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos de notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-color);
        border-radius: 15px;
        padding: 1rem 1.5rem;
        box-shadow: 0 8px 32px var(--shadow-color);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        color: var(--text-primary);
    `;
    
    // Colores por tipo
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.borderLeftColor = colors[type];
    
    document.body.appendChild(notification);
    
    // Auto-remover
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Obtener icono de notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Agregar estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: var(--transition);
    }
    
    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--text-primary);
    }
`;
document.head.appendChild(notificationStyles);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Manejar visibilidad de la página para auto-guardado
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        saveData();
    }
});

// Manejar cierre de ventana
window.addEventListener('beforeunload', (e) => {
    saveData();
    // Opcional: mostrar confirmación si hay cambios sin guardar
    const hasUnsavedChanges = checkForUnsavedChanges();
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Verificar cambios sin guardar
function checkForUnsavedChanges() {
    const currentData = getCurrentFormData();
    const savedData = JSON.parse(localStorage.getItem('tesisgo-data') || '{}');
    
    return JSON.stringify(currentData) !== JSON.stringify(savedData);
}

// Obtener datos actuales del formulario
function getCurrentFormData() {
    return {
        tema: document.getElementById('tema').value,
        problema: document.getElementById('problema').value,
        justificacion: document.getElementById('justificacion').value,
        objetivoGeneral: document.getElementById('objetivo-general').value,
        objetivosEspecificos: document.getElementById('objetivos-especificos').value,
        hipotesis: document.getElementById('hipotesis').value,
        metodologia: document.getElementById('metodologia').value,
        poblacion: document.getElementById('poblacion').value,
        citas: document.getElementById('citas').value
    };
}

// Función de ayuda y tutorial
function showHelp() {
    const helpContent = `
        <div class="help-modal">
            <div class="help-content">
                <h2><i class="fas fa-question-circle"></i> Ayuda - TesisGO AI</h2>
                
                <div class="help-section">
                    <h3>🚀 Primeros Pasos</h3>
                    <p>1. Completa cada fase en orden secuencial</p>
                    <p>2. Usa las sugerencias de IA para mejorar tu contenido</p>
                    <p>3. Guarda automáticamente tu progreso</p>
                </div>
                
                <div class="help-section">
                    <h3>🤖 Asistente IA</h3>
                    <p>• Haz clic en el botón del robot para obtener sugerencias</p>
                    <p>• Las sugerencias se adaptan a cada fase</p>
                    <p>• Usa "Generar Sugerencias IA" para contenido específico</p>
                </div>
                
                <div class="help-section">
                    <h3>💾 Guardado y Exportación</h3>
                    <p>• Tu trabajo se guarda automáticamente</p>
                    <p>• Exporta en PDF o Word desde la fase final</p>
                    <p>• Comparte tu proyecto con otros</p>
                </div>
                
                <button onclick="closeHelp()" class="help-close-btn">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    `;
    
    const helpModal = document.createElement('div');
    helpModal.innerHTML = helpContent;
    helpModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;
    
    document.body.appendChild(helpModal);
}

function closeHelp() {
    const helpModal = document.querySelector('.help-modal').closest('div');
    helpModal.remove();
}

// Agregar estilos para el modal de ayuda
const helpStyles = document.createElement('style');
helpStyles.textContent = `
    .help-content {
        background: var(--bg-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: var(--text-primary);
    }
    
    .help-section {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: 12px;
    }
    
    .help-section h3 {
        margin-bottom: 0.5rem;
        color: var(--primary-purple);
    }
    
    .help-close-btn {
        background: var(--primary-purple);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 600;
        display: block;
        margin: 2rem auto 0;
        transition: var(--transition);
    }
    
    .help-close-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px var(--shadow-color);
    }
`;
document.head.appendChild(helpStyles);

console.log('TesisGO AI inicializado correctamente ✨');