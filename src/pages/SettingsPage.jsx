import { useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useAuth } from '../store/AuthContext'
import { exportData } from '../utils/storageUtils'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function SettingsPage() {
  const { state, importData, clearAllData } = useAppStore()
  const { user, logout } = useAuth()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const fileRef = useRef(null)

  function handleExport() {
    exportData(state)
  }

  function handleImportClick() {
    fileRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data.plans || !data.checkIns) throw new Error('格式错误')
        importData(data)
        setImportMsg('✅ 数据导入成功！')
      } catch {
        setImportMsg('❌ 文件格式不正确，请选择正确的备份文件')
      }
      e.target.value = ''
      setTimeout(() => setImportMsg(''), 4000)
    }
    reader.readAsText(file)
  }

  const activePlans = state.plans.filter(p => !p.archived)

  return (
    <div className="animate-fade-up">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-text-primary">设置</h1>
        <p className="text-xs text-text-light mt-0.5">管理你的数据</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats summary */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">数据概览</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>计划总数</span>
              <span className="font-medium text-text-primary">{activePlans.length} 个</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>打卡记录</span>
              <span className="font-medium text-text-primary">{state.checkIns.length} 条</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>数据版本</span>
              <span className="font-medium text-text-primary">{state.version}</span>
            </div>
          </div>
        </Card>

        {/* Data management */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">数据管理</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-warm-50 hover:bg-warm-100 transition-colors cursor-pointer border-none text-left"
            >
              <div>
                <div className="text-sm font-medium text-text-primary">导出数据</div>
                <div className="text-xs text-text-light">下载 JSON 备份文件</div>
              </div>
              <span className="text-lg">📤</span>
            </button>

            <button
              onClick={handleImportClick}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-warm-50 hover:bg-warm-100 transition-colors cursor-pointer border-none text-left"
            >
              <div>
                <div className="text-sm font-medium text-text-primary">导入数据</div>
                <div className="text-xs text-text-light">从备份文件恢复（会覆盖当前数据）</div>
              </div>
              <span className="text-lg">📥</span>
            </button>

            {importMsg && (
              <div className={`text-xs px-3 py-2 rounded-xl ${importMsg.startsWith('✅') ? 'bg-mint-100 text-mint-300' : 'bg-red-50 text-coral'}`}>
                {importMsg}
              </div>
            )}

            <button
              onClick={() => setConfirmClear(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border-none text-left"
            >
              <div>
                <div className="text-sm font-medium text-coral">清空所有数据</div>
                <div className="text-xs text-text-light">删除所有计划和打卡记录</div>
              </div>
              <span className="text-lg">🗑️</span>
            </button>
          </div>
        </Card>

        {/* Account */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">账号</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-text-primary">
                👤 {user?.username || '未知用户'}
              </div>
              <div className="text-xs text-text-light mt-0.5">数据存储在服务器，跨设备同步</div>
            </div>
            <button
              onClick={() => setConfirmLogout(true)}
              className="text-xs text-coral hover:underline cursor-pointer border-none bg-transparent font-medium"
            >
              退出登录
            </button>
          </div>
        </Card>

        {/* About */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-2">关于</h3>
          <div className="space-y-1 text-sm text-text-secondary">
            <p>打卡计划 · 版本 1.0</p>
            <p className="text-xs text-text-light leading-relaxed">
              一个帮你坚持习惯、追踪目标的小工具。
            </p>
          </div>
        </Card>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clearAllData}
        title="清空所有数据"
        message="此操作不可恢复，所有计划和打卡记录将被永久删除。"
        confirmLabel="确认清空"
      />

      <ConfirmDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        title="退出登录"
        message={`确定要退出账号「${user?.username}」吗？`}
        confirmLabel="退出"
      />
    </div>
  )
}
