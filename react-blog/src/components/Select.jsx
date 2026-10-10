import React,{useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
},ref) {
    const id = useId()
  return (
    <div className='w-full'>
        
        {label && <label htmlFor={id} className='mb-2 inline-block text-sm font-semibold text-[#172b3a]'>
            {label}
        </label>}
        <select
            {...props}
            id={id}
            ref={ref}
            className={`w-full rounded-xl border border-[#e9e2d7] bg-white px-4 py-3 text-[#172b3a] outline-none transition focus:border-[#b77945] ${className}`}
            >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)