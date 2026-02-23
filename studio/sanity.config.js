import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

export default defineConfig({
  name: 'default',
  title: 'How Models Wander',
  projectId: '2mcrd1vx',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    types: [
      {
        name: 'post',
        type: 'document',
        title: 'Archive Posts',
        fields: [
          { name: 'image', type: 'image', title: 'Photo' },
          { name: 'location', type: 'string', title: 'Location' },
          { name: 'syncScore', type: 'string', title: 'Sync Score' },
          { name: 'body', type: 'text', title: 'Description' }
        ]
      }
    ],
  },
})