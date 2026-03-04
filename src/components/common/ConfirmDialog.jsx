import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = '确认删除', message, confirmLabel = '删除', confirmVariant = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        {message && <p className="text-sm text-text-secondary mb-6">{message}</p>}
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button variant={confirmVariant} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}
