import {useEffect, useRef} from 'react'
import {PatchEvent, set, type ArrayOfObjectsInputProps} from 'sanity'
import {ensureArrayKeysDeep} from '../../../shared/cms/ensureArrayKeys'

/** Auto-repair missing `_key` on array items so Studio lists stay editable. */
export const EnsureKeysArrayInput = (props: ArrayOfObjectsInputProps) => {
  const {value, onChange, renderDefault} = props
  const repairedRef = useRef(false)

  useEffect(() => {
    if (repairedRef.current || !Array.isArray(value) || value.length === 0) return

    const {value: fixed, changed} = ensureArrayKeysDeep(value)
    if (!changed) return

    repairedRef.current = true
    onChange(PatchEvent.from(set(fixed)))
  }, [value, onChange])

  return renderDefault(props)
}
