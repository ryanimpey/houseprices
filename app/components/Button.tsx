import React from 'react'

type ButtonProps = {
  link?: boolean
}

function Button(props: React.HTMLProps<HTMLButtonElement> & ButtonProps) {
  return (
    <button className='button--primary text--cabin--bold py-1' {...props} type="button">{props.children}</button>
  )
}

export default Button