/**
 * Form Handler Component
 * Maneja validación, envío y feedback de formularios
 */

import { debounce, isValidEmail, formatString } from '../utils/helpers.js';
import { 
    FORM_CONFIG, 
    VALIDATION_PATTERNS, 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES,
    CUSTOM_EVENTS 
} from '../utils/constants.js';

export class FormHandler {
    constructor() {
        this.forms = new Map();
        this.validators = new Map();
        this.isSubmitting = false;
        
        // Bind methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = debounce(this.handleInput.bind(this), FORM_CONFIG.debounceDelay);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        
        this.init();
    }

    /**
     * Initialize form handler
     */
    init() {
        this.setupValidators();
        this.bindForms();
        this.setupRealTimeValidation();
        
        console.log('✅ Form Handler initialized');
    }

    /**
     * Setup form validators
     */
    setupValidators() {
        this.validators.set('required', {
            validate: (value) => value.trim().length > 0,
            message: ERROR_MESSAGES.required
        });
        
        this.validators.set('email', {
            validate: (value) => !value || isValidEmail(value),
            message: ERROR_MESSAGES.email
        });
        
        this.validators.set('minLength', {
            validate: (value, min) => !value || value.length >= min,
            message: (min) => formatString(ERROR_MESSAGES.minLength, { min })
        });
        
        this.validators.set('maxLength', {
            validate: (value, max) => !value || value.length <= max,
            message: (max) => formatString(ERROR_MESSAGES.maxLength, { max })
        });
        
        this.validators.set('pattern', {
            validate: (value, pattern) => !value || pattern.test(value),
            message: 'El formato no es válido'
        });
        
        this.validators.set('name', {
            validate: (value) => !value || VALIDATION_PATTERNS.name.test(value),
            message: 'Solo se permiten letras y espacios (2-50 caracteres)'
        });
    }

    /**
     * Bind all forms on the page
     */
    bindForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.bindForm(form);
        });
        
        console.log(`📝 Found and bound ${forms.length} forms`);
    }

    /**
     * Bind individual form
     */
    bindForm(form) {
        if (!form || this.forms.has(form)) return;
        
        const formData = {
            element: form,
            fields: new Map(),
            isValid: false,
            errors: new Map()
        };
        
        // Cache form fields
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            formData.fields.set(field.name || field.id, {
                element: field,
                isValid: false,
                error: null,
                rules: this.parseValidationRules(field)
            });
        });
        
        this.forms.set(form, formData);
        
        // Bind events
        form.addEventListener('submit', this.handleSubmit);
        
        // Bind field events
        fields.forEach(field => {
            field.addEventListener('input', this.handleInput);
            field.addEventListener('blur', this.handleBlur);
            field.addEventListener('focus', this.handleFocus);
        });
    }

    /**
     * Parse validation rules from field attributes
     */
    parseValidationRules(field) {
        const rules = [];
        
        // Required validation
        if (field.hasAttribute('required')) {
            rules.push({ type: 'required' });
        }
        
        // Email validation
        if (field.type === 'email') {
            rules.push({ type: 'email' });
        }
        
        // Pattern validation
        if (field.hasAttribute('pattern')) {
            const pattern = new RegExp(field.getAttribute('pattern'));
            rules.push({ type: 'pattern', value: pattern });
        }
        
        // Length validations
        if (field.hasAttribute('minlength')) {
            const min = parseInt(field.getAttribute('minlength'));
            rules.push({ type: 'minLength', value: min });
        }
        
        if (field.hasAttribute('maxlength')) {
            const max = parseInt(field.getAttribute('maxlength'));
            rules.push({ type: 'maxLength', value: max });
        }
        
        // Name validation (custom)
        if (field.name === 'name' || field.id === 'name') {
            rules.push({ type: 'name' });
        }
        
        return rules;
    }

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        // Enable real-time validation after user interaction
        document.addEventListener('focusout', (event) => {
            const field = event.target;
            if (this.isFormField(field)) {
                this.validateField(field);
            }
        });
    }

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        const form = event.target;
        const formData = this.forms.get(form);
        
        if (!formData) {
            console.warn('Form not found in handler');
            return;
        }
        
        // Validate entire form
        const isValid = this.validateForm(form);
        
        if (!isValid) {
            this.focusFirstError(form);
            this.showNotification('Por favor, corrige los errores en el formulario', 'error');
            return;
        }
        
        try {
            this.isSubmitting = true;
            this.setSubmitState(form, true);
            
            // Dispatch form submit event
            this.dispatchEvent(CUSTOM_EVENTS.FORM_SUBMIT, {
                form: form.id,
                data: this.getFormData(form)
            });
            
            // Simulate API call (replace with your actual submission logic)
            await this.submitForm(form);
            
            // Success handling
            this.handleSubmitSuccess(form);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmitError(form, error);
        } finally {
            this.isSubmitting = false;
            this.setSubmitState(form, false);
        }
    }

    /**
     * Submit form (mock implementation)
     */
    async submitForm(form) {
        const formData = this.getFormData(form);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/error for demo
        // Remove this and implement your actual API call
        if (Math.random() > 0.8) {
            throw new Error('Simulated server error');
        }
        
        console.log('Form data submitted:', formData);
        
        // Here you would typically make your API call:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        */
    }

    /**
     * Handle successful form submission
     */
    handleSubmitSuccess(form) {
        // Reset form
        form.reset();
        this.clearAllErrors(form);
        
        // Show success message
        this.showNotification(SUCCESS_MESSAGES.formSubmit, 'success');
        
        // Dispatch success event
        this.dispatchEvent(CUSTOM_EVENTS.FORM_SUCCESS, {
            form: form.id
        });
        
        // Optional: scroll to top or redirect
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Handle form submission error
     */
    handleSubmitError(form, error) {
        let message = ERROR_MESSAGES.generic;
        
        // Customize error message based on error type
        if (error.message.includes('Network')) {
            message = ERROR_MESSAGES.network;
        } else if (error.message.includes('500')) {
            message = ERROR_MESSAGES.server;
        }
        
        this.showNotification(message, 'error');
        
        // Dispatch error event
        this.dispatchEvent(CUSTOM_EVENTS.FORM_ERROR, {
            form: form.id,
            error: error.message
        });
    }

    /**
     * Handle input events
     */
    handleInput(event) {
        const field = event.target;
        this.clearFieldError(field);
        
        // Real-time validation for fields that have been blurred
        if (field.dataset.hasBlurred === 'true') {
            this.validateField(field);
        }
    }

    /**
     * Handle blur events
     */
    handleBlur(event) {
        const field = event.target;
        field.dataset.hasBlurred = 'true';
        this.validateField(field);
    }

    /**
     * Handle focus events
     */
    handleFocus(event) {
        const field = event.target;
        this.clearFieldError(field);
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        const formData = this.forms.get(form);
        if (!formData) return false;
        
        let isValid = true;
        
        formData.fields.forEach((fieldData, fieldName) => {
            const fieldValid = this.validateField(fieldData.element);
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        formData.isValid = isValid;
        return isValid;
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        if (!this.isFormField(field)) return true;
        
        const form = field.closest('form');
        const formData = this.forms.get(form);
        
        if (!formData) return true;
        
        const fieldData = formData.fields.get(field.name || field.id);
        if (!fieldData) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = null;
        
        // Run validation rules
        for (const rule of fieldData.rules) {
            const validator = this.validators.get(rule.type);
            
            if (!validator) continue;
            
            const valid = validator.validate(value, rule.value);
            
            if (!valid) {
                isValid = false;
                errorMessage = typeof validator.message === 'function' 
                    ? validator.message(rule.value)
                    : validator.message;
                break;
            }
        }
        
        // Update field state
        fieldData.isValid = isValid;
        fieldData.error = errorMessage;
        
        // Update UI
        this.updateFieldUI(field, isValid, errorMessage);
        
        return isValid;
    }

    /**
     * Update field UI based on validation state
     */
    updateFieldUI(field, isValid, errorMessage) {
        const errorElement = document.getElementById(`${field.name || field.id}-error`);
        
        // Update field classes
        field.classList.toggle('error', !isValid);
        field.setAttribute('aria-invalid', !isValid);
        
        // Update error message
        if (errorElement) {
            if (!isValid && errorMessage) {
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('visually-hidden');
            } else {
                errorElement.textContent = '';
                errorElement.classList.add('visually-hidden');
            }
        }
        
        // Update field validation state for styling
        if (field.value.trim()) {
            field.setAttribute('data-validation-state', isValid ? 'valid' : 'invalid');
        } else {
            field.removeAttribute('data-validation-state');
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name || field.id}-error`);
        
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('data-validation-state');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('visually-hidden');
        }
    }

    /**
     * Clear all form errors
     */
    clearAllErrors(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.clearFieldError(field);
            delete field.dataset.hasBlurred;
        });
    }

    /**
     * Focus first error field
     */
    focusFirstError(form) {
        const errorField = form.querySelector('.error');
        if (errorField) {
            errorField.focus();
            errorField.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    /**
     * Set form submit state
     */
    setSubmitState(form, isSubmitting) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!submitButton) return;
        
        const originalText = submitButton.dataset.originalText || submitButton.innerHTML;
        
        if (isSubmitting) {
            submitButton.dataset.originalText = originalText;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
        } else {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            delete submitButton.dataset.originalText;
        }
    }

    /**
     * Get form data as object
     */
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    /**
     * Check if element is a form field
     */
    isFormField(element) {
        return element && ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);
    }

    /**
     * Add custom validator
     */
    addValidator(name, validator) {
        this.validators.set(name, validator);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    /**
     * Dispatch custom events
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Destroy form handler
     */
    destroy() {
        // Remove event listeners from all forms
        this.forms.forEach((formData, form) => {
            form.removeEventListener('submit', this.handleSubmit);
            
            formData.fields.forEach((fieldData) => {
                const field = fieldData.element;
                field.removeEventListener('input', this.handleInput);
                field.removeEventListener('blur', this.handleBlur);
                field.removeEventListener('focus', this.handleFocus);
                
                // Clean up field state
                this.clearFieldError(field);
                delete field.dataset.hasBlurred;
            });
        });
        
        // Clear collections
        this.forms.clear();
        this.validators.clear();
        
        // Reset state
        this.isSubmitting = false;
        
        console.log('🧹 Form Handler destroyed');
    }
}