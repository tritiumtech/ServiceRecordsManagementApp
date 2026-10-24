import path from 'path'
import { buildFigmaConfig } from '@payloadcms/figma'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { zh as zhAdminLanguage } from '@payloadcms/translations/languages/zh'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Posts } from './collections/Posts'
import { ServiceQualitySettings } from './globals/ServiceQualitySettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildFigmaConfig({
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { 'en': adminLanguage, 'zh': zhAdminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, Posts],
  globals: [ServiceQualitySettings],
  localization: {
    locales: [
      { code: 'zh', label: '中文' },
      { code: 'en', label: 'English' },
    ],
    fallback: true,
    defaultLocale: 'zh',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [mcpPlugin({})],
  figma: {},
})
