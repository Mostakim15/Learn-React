import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='mb-2 inline-block text-sm font-semibold text-[#172b3a]' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`w-full rounded-xl border border-[#e9e2d7] bg-white px-4 py-3 text-[#172b3a] outline-none transition placeholder:text-[#9a9b9d] focus:border-[#b77945] ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input