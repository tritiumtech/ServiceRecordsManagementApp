import type { GlobalConfig } from 'payload'

export const ServiceQualitySettings: GlobalConfig = {
  slug: 'service-quality-settings',
  label: 'Service quality instructions',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Service records',
  },
  fields: [
    {
      name: 'instructions',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: 'Mandatory information the service memo must include. The quality checker uses this text directly.',
        rows: 12,
      },
    },
    {
      name: 'suggestedFormat',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: 'A concise suggested structure shown beneath the instructions.',
        rows: 6,
      },
    },
  ],
}
