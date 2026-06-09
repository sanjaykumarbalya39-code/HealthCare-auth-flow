(function () {
  'use strict';

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, errorEl, message) {
    if (input) {
      input.classList.add('is-error');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    if (input) {
      input.classList.remove('is-error');
      input.setAttribute('aria-invalid', 'false');
    }
    if (errorEl) errorEl.textContent = '';
  }

  function setValid(input) {
    if (input) {
      input.classList.remove('is-error');
      input.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
    }
  }

  function syncPasswordToggle(btn, input) {
    if (!btn || !input) return;
    var isHidden = input.type === 'password';
    btn.setAttribute('aria-pressed', isHidden ? 'false' : 'true');
    btn.setAttribute('aria-label', isHidden ? 'Show password' : 'Hide password');
    var showIcon = btn.querySelector('.icon-show');
    var hideIcon = btn.querySelector('.icon-hide');
    if (showIcon && hideIcon) {
      showIcon.hidden = isHidden;
      hideIcon.hidden = !isHidden;
    }
  }

  function initPasswordToggle() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      var targetId = btn.getAttribute('aria-controls');
      var input = document.getElementById(targetId);
      if (input) {
        input.type = 'password';
        syncPasswordToggle(btn, input);
      }

      btn.addEventListener('click', function () {
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
        syncPasswordToggle(btn, input);
      });
    });
  }

  function getRoleFromSelect(selectEl) {
    if (!selectEl) return 'researcher';
    return selectEl.value || 'researcher';
  }

  function validateEmail(value) {
    return EMAIL_REGEX.test(String(value).trim());
  }

  function validatePassword(value, min) {
    return String(value).length >= (min || 6);
  }

  function deriveNameFromEmail(email) {
    var local = String(email).split('@')[0] || '';
    var parts = local.replace(/[._+-]/g, ' ').split(/\s+/).filter(Boolean);
    if (!parts.length) return 'Stackly User';
    return parts.map(function (p) {
      return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    }).join(' ');
  }

  function saveUserSession(email, name, role, organization) {
    var trimmedEmail = String(email).trim().toLowerCase();
    sessionStorage.setItem('stackly_role', role);
    sessionStorage.setItem('stackly_user_email', trimmedEmail);
    if (name && name.trim()) {
      sessionStorage.setItem('stackly_user_name', name.trim());
    } else {
      sessionStorage.setItem('stackly_user_name', deriveNameFromEmail(trimmedEmail));
    }
    if (organization && organization.trim()) {
      sessionStorage.setItem('stackly_user_org', organization.trim());
    }
  }

  function redirectByRole(role) {
    if (role === 'researcher') {
      window.location.href = 'dashboard-researcher.html';
    } else {
      window.location.href = 'dashboard-user.html';
    }
  }

  function initLogin() {
    var form = document.getElementById('loginForm');
    if (!form) return;

    var roleSelect = document.getElementById('loginRole');
    var emailInput = document.getElementById('loginEmail');
    var passwordInput = document.getElementById('loginPassword');
    var emailError = document.getElementById('loginEmailError');
    var passwordError = document.getElementById('loginPasswordError');

    emailInput.addEventListener('blur', function () {
      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Email is required.');
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
      } else {
        clearError(emailInput, emailError);
        setValid(emailInput);
      }
    });

    passwordInput.addEventListener('blur', function () {
      if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      } else {
        clearError(passwordInput, passwordError);
        setValid(passwordInput);
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Email is required.');
        valid = false;
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(emailInput, emailError);
        setValid(emailInput);
      }

      if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
        valid = false;
      } else {
        clearError(passwordInput, passwordError);
        setValid(passwordInput);
      }

      if (!valid) {
        var firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      var role = getRoleFromSelect(roleSelect);
      saveUserSession(emailInput.value, '', role);
      redirectByRole(role);
    });
  }

  function initSignup() {
    var form = document.getElementById('signupForm');
    if (!form) return;

    var roleSelect = document.getElementById('signupRole');
    var successEl = document.getElementById('signupSuccess');
    var fields = {
      fullName: { input: document.getElementById('signupName'), error: document.getElementById('signupNameError') },
      email: { input: document.getElementById('signupEmail'), error: document.getElementById('signupEmailError') },
      password: { input: document.getElementById('signupPassword'), error: document.getElementById('signupPasswordError') },
      confirmPassword: { input: document.getElementById('signupConfirm'), error: document.getElementById('signupConfirmError') },
      organization: { input: document.getElementById('signupOrg'), error: document.getElementById('signupOrgError') },
      role: { input: roleSelect, error: document.getElementById('signupRoleError') },
      terms: { input: document.getElementById('signupTerms'), error: document.getElementById('signupTermsError') }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!fields.fullName.input.value.trim()) {
        showError(fields.fullName.input, fields.fullName.error, 'Full name is required.');
        valid = false;
      } else {
        clearError(fields.fullName.input, fields.fullName.error);
        setValid(fields.fullName.input);
      }

      if (!fields.role.input.value) {
        showError(fields.role.input, fields.role.error, 'Please select a role.');
        valid = false;
      } else {
        clearError(fields.role.input, fields.role.error);
        setValid(fields.role.input);
      }

      if (!fields.email.input.value.trim()) {
        showError(fields.email.input, fields.email.error, 'Email is required.');
        valid = false;
      } else if (!validateEmail(fields.email.input.value)) {
        showError(fields.email.input, fields.email.error, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(fields.email.input, fields.email.error);
        setValid(fields.email.input);
      }

      if (!validatePassword(fields.password.input.value)) {
        showError(fields.password.input, fields.password.error, 'Password must be at least 6 characters.');
        valid = false;
      } else {
        clearError(fields.password.input, fields.password.error);
        setValid(fields.password.input);
      }

      if (fields.password.input.value !== fields.confirmPassword.input.value) {
        showError(fields.confirmPassword.input, fields.confirmPassword.error, 'Passwords do not match.');
        valid = false;
      } else if (fields.confirmPassword.input.value) {
        clearError(fields.confirmPassword.input, fields.confirmPassword.error);
        setValid(fields.confirmPassword.input);
      } else {
        showError(fields.confirmPassword.input, fields.confirmPassword.error, 'Please confirm your password.');
        valid = false;
      }

      if (!fields.organization.input.value.trim()) {
        showError(fields.organization.input, fields.organization.error, 'Organization is required.');
        valid = false;
      } else {
        clearError(fields.organization.input, fields.organization.error);
        setValid(fields.organization.input);
      }

      if (!fields.terms.input.checked) {
        if (fields.terms.error) fields.terms.error.textContent = 'You must accept the terms and conditions.';
        valid = false;
      } else if (fields.terms.error) {
        fields.terms.error.textContent = '';
      }

      if (!valid) {
        var firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      if (successEl) {
        successEl.classList.add('is-visible');
        successEl.setAttribute('aria-live', 'polite');
      }

      setTimeout(function () {
        window.location.href = 'login.html';
      }, 2000);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPasswordToggle();
    initLogin();
    initSignup();
  });
})();
