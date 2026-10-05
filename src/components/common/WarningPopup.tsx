export type WarningPopupProps = {
    message : string
    onClose : () => void
}

export const WarningPopup = ({ message, onClose } : WarningPopupProps) => {
    return (
        <div className="p-today__caution">
            <div className="p-today__caution-inner">
                <button onClick={onClose}>
                    <img src="./images/icon_close.svg" alt="閉じる" />
                </button>
                <p className='message'>{message}</p>
            </div>
        </div>
    )
}