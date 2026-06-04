/**
 * UI 模块 - Toast提示、加载状态
 */
const UI = (() => {
  let toastContainer = null;
  let loadingOverlay = null;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, type) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'success');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function ensureLoadingOverlay() {
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(loadingOverlay);
    }
    return loadingOverlay;
  }

  function showLoading() {
    ensureLoadingOverlay().classList.add('show');
  }

  function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  return { showToast, showLoading, hideLoading };
})();

// 全局快捷引用
const showToast = UI.showToast.bind(UI);
const showLoading = UI.showLoading.bind(UI);
const hideLoading = UI.hideLoading.bind(UI);