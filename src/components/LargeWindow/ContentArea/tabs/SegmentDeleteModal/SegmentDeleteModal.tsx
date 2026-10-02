import './SegmentDeleteModal.scss'

type SegmentDeleteModalProps = {
    onConfirm : () => void
    onCancel : () => void
}

export function SegmentDeleteModal({onConfirm,onCancel}:SegmentDeleteModalProps){
    return (
        <div className='p-delete-modal' onClick={onCancel}>
            <div className='p-delete-modal__inner' onClick={(e) => e.stopPropagation()}>
                <button className='p-delete-modal__close' onClick={onCancel}><img src="../images/icon_close.svg" alt="閉じる" /></button>
                <p className='p-delete-modal__text'>この記録を本当に削除しますか？</p>
                <p className='p-delete-modal__caution'>※この操作は取り消せません。</p>
                <div className='p-delete-modal__buttons'>
                    <button className='no' onClick={onCancel}>キャンセル</button>
                    <button className='yes' onClick={onConfirm}>削除</button>
                </div>
            </div>
        </div>
    )
}