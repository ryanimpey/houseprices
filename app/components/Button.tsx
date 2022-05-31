import React from 'react'

function Button(props: React.HTMLProps<HTMLButtonElement>) {
  return (
    <button className='button--primary text--cabin--bold py-1' {...props} type="button">{props.children}</button>
  )
}

export default Button