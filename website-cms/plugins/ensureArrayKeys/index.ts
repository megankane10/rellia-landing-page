import {definePlugin} from 'sanity'
import {EnsureKeysArrayInput} from './EnsureKeysArrayInput'

const isObjectArrayInput = (schemaType: {name?: string; of?: Array<{name?: string; type?: string}>}) => {
  if (schemaType.name !== 'array') return false
  const members = schemaType.of ?? []
  return members.some((member) => member.name === 'object' || member.type === 'object')
}

export const ensureArrayKeysPlugin = definePlugin({
  name: 'ensure-array-keys',
  form: {
    components: {
      input: (props) => {
        if (!isObjectArrayInput(props.schemaType)) {
          return props.renderDefault(props)
        }

        return EnsureKeysArrayInput(props as Parameters<typeof EnsureKeysArrayInput>[0])
      },
    },
  },
})
