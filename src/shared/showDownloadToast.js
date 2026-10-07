import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import texts from '@/locales/es.json'

export function showDownloadToast() {
  const toast = Toastify({
    text: texts.export.success,
    duration: 3500,
    gravity: 'bottom',
    position: 'center',
    close: true,
    stopOnFocus: true,
    ariaLive: 'polite',
    className: 'download-toast',
    style: { background: '#ecfdf5', color: '#065f46' },
  })
  toast.showToast()
  toast.toastElement
    .querySelector('.toast-close')
    ?.setAttribute('aria-label', texts.export.closeToast)
}
