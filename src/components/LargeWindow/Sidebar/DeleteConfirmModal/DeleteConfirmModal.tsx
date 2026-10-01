import './DeleteConfirmModal.scss'
import { useProjectContext } from "../../../../contexts/ProjectContext";
import { type DeleteTarget } from "../Sidebar"

type DeleteConfirmModalProps = {
    deleteTarget : DeleteTarget
    setDeleteTarget : (target:DeleteTarget) => void
    handleDeleteClient : (id:number) => void
}

export function DeleteConfirmModal({deleteTarget,setDeleteTarget,handleDeleteClient} : DeleteConfirmModalProps){
    const { deleteProject } = useProjectContext()
    const handleConfirmDelete = () => {
        if(deleteTarget?.type === 'client'){
            handleDeleteClient(deleteTarget.id)
        } else if (deleteTarget?.type === 'project'){
            deleteProject(deleteTarget.id)
        }
        setDeleteTarget(null)
    }
    return (
        <div className='p-delete-modal' onClick={() => setDeleteTarget(null)}>
            <div className='p-delete-modal__inner' onClick={(e) => e.stopPropagation()}>
                <button className='p-delete-modal__close' onClick={() => setDeleteTarget(null)}><img src="../images/icon_close.svg" alt="閉じる" /></button>
                <p className='p-delete-modal__text'>「{deleteTarget?.name}」<br />過去の記録ごと削除されます。<br />本当に削除しますか？</p>
                <p className='p-delete-modal__caution'>※この操作は取り消せません。</p>
                <div className='p-delete-modal__buttons'>
                    <button className='no' onClick={() => setDeleteTarget(null)}>キャンセル</button>
                    <button className='yes' onClick={handleConfirmDelete}>削除</button>
                </div>
            </div>
        </div>
    )
}