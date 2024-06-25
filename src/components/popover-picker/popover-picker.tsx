import React, { Dispatch, FC, SetStateAction, useCallback, useRef, useState } from 'react'
import { Color, ColorPicker } from 'react-color-palette'
import './popover-picket.css'
import useClickOutside from '../../services/hooks/use-click-outside'

interface IPopoverPicker {
  color: Color
  onChange: Dispatch<SetStateAction<Color>>
}
const PopoverPicker: FC<IPopoverPicker> = ({ color, onChange }) => {
  const popover = useRef<HTMLDivElement>(null)
  const [isOpen, toggle] = useState(false)
  const close = useCallback(() => toggle(false), [])
  useClickOutside(popover, close)

  return (
    <div className="picker">
      <div
        className="swatch"
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        style={{ backgroundColor: color.hex.toString() }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className="popover" ref={popover}>
          <ColorPicker color={color} onChange={onChange} width={240} height={100} hideHSV dark/>
        </div>
      )}
    </div>
  )
}
export default PopoverPicker
