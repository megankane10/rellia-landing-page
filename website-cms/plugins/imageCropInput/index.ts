import {definePlugin, type ObjectInputProps} from 'sanity'
import type {ImageValue} from 'sanity'
import {CroppedImageInput} from './CroppedImageInput'

export const imageCropInputPlugin = definePlugin({
  name: 'image-crop-input',
  form: {
    components: {
      input: (props) => {
        if (props.schemaType.name !== 'image') {
          return props.renderDefault(props)
        }

        return CroppedImageInput(props as ObjectInputProps<ImageValue>)
      },
    },
  },
})
