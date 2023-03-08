import React, { forwardRef } from 'react'

const CustomEditor = forwardRef(({ref}) => {
  return (
    <div ref={ref}>CustomEditor</div>
  )
})

export default CustomEditor