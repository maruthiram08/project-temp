/**
 * Form Schema and Render Config for Transfer Bonus category
 */

import { FormSchema, RenderConfig } from '@/types/form-config'

export const transferBonusFormSchema: FormSchema = {
  sections: [
    { id: 'basic', title: 'Basic Information', order: 1 },
    { id: 'transfer', title: 'Transfer Configuration', order: 2 },
    { id: 'bonus', title: 'Bonus Details', order: 3 },
    { id: 'status', title: 'Active Status', order: 4 },
    { id: 'details', title: 'Details & Content', order: 5 },
    { id: 'settings', title: 'Settings', order: 6 }
  ],
  fields: [
    // ========================================================================
    // Basic Information
    // ========================================================================
    {
      name: 'bankId',
      label: 'Bank',
      type: 'select',
      section: 'basic',
      required: true,
      order: 1,
      helpText: 'Select the bank/card program offering this transfer bonus'
    },
    {
      name: 'categoryData.shortDescription',
      label: 'Short Description',
      type: 'textarea',
      section: 'basic',
      required: true,
      order: 2,
      placeholder: 'e.g., Limited time 15% bonus on transfers to KrisFlyer',
      validation: { max: 200 },
      helpText: 'Brief description (max 200 characters)'
    },
    {
      name: 'expiryDateTime',
      label: 'Expiry Date & Time',
      type: 'datetime',
      section: 'basic',
      required: true,
      order: 3,
      helpText: 'When this transfer bonus expires (always required)'
    },
    {
      name: 'expiryDisplayFormat',
      label: 'Expiry Display Format',
      type: 'select',
      section: 'basic',
      required: true,
      order: 4,
      defaultValue: 'date',
      options: [
        { label: 'Date Only', value: 'date' },
        { label: 'Countdown Only', value: 'countdown' },
        { label: 'Both Date and Countdown', value: 'both' }
      ]
    },

    // ========================================================================
    // Transfer Configuration
    // ========================================================================
    {
      name: 'categoryData.sourceProgram',
      label: 'Source Program',
      type: 'text',
      section: 'transfer',
      required: true,
      order: 1,
      placeholder: 'e.g., Axis Edge Rewards',
      validation: { max: 80 },
      helpText: 'The loyalty program you\'re transferring FROM'
    },
    {
      name: 'categoryData.destinationProgram',
      label: 'Destination Program',
      type: 'text',
      section: 'transfer',
      required: true,
      order: 2,
      placeholder: 'e.g., Singapore Airlines KrisFlyer',
      validation: { max: 80 },
      helpText: 'The loyalty program you\'re transferring TO'
    },
    {
      name: 'categoryData.transferRatioFrom',
      label: 'Transfer Ratio - From',
      type: 'text',
      section: 'transfer',
      required: true,
      order: 3,
      placeholder: 'e.g., 1000',
      helpText: 'How many points in source program (e.g., 1000 Edge points)'
    },
    {
      name: 'categoryData.transferRatioTo',
      label: 'Transfer Ratio - To',
      type: 'text',
      section: 'transfer',
      required: true,
      order: 4,
      placeholder: 'e.g., 1000',
      helpText: 'Converts to how many points in destination (e.g., 1000 KrisFlyer miles)'
    },

    // ========================================================================
    // Bonus Details
    // ========================================================================
    {
      name: 'categoryData.bonusValue',
      label: 'Bonus Value',
      type: 'text',
      section: 'bonus',
      required: true,
      order: 1,
      placeholder: 'e.g., 15',
      helpText: 'The bonus percentage or amount'
    },
    {
      name: 'categoryData.bonusUnit',
      label: 'Bonus Unit',
      type: 'select',
      section: 'bonus',
      required: true,
      order: 2,
      options: [
        { label: 'Percentage (%)', value: '%' },
        { label: 'Points (pts)', value: 'pts' },
        { label: 'Miles', value: 'miles' },
        { label: 'Multiplier (x)', value: 'x' }
      ],
      helpText: 'Unit for the bonus value'
    },
    {
      name: 'categoryData.bonusColor',
      label: 'Badge Color',
      type: 'color',
      section: 'bonus',
      required: true,
      order: 3,
      defaultValue: '#8b5cf6',
      helpText: 'Background color for the bonus badge'
    },

    // ========================================================================
    // Active Status (Operational)
    // ========================================================================
    {
      name: 'isActive',
      label: 'Transfer Currently Active',
      type: 'boolean',
      section: 'status',
      required: false,
      order: 1,
      defaultValue: true,
      helpText: 'Toggle if transfer is temporarily paused/unavailable'
    },
    {
      name: 'statusBadgeText',
      label: 'Status Badge Text',
      type: 'text',
      section: 'status',
      required: false,
      order: 2,
      placeholder: 'e.g., Active, Paused, Limited Availability',
      validation: { max: 30 },
      helpText: 'Custom status text (optional)'
    },
    {
      name: 'statusBadgeColor',
      label: 'Status Badge Color',
      type: 'color',
      section: 'status',
      required: false,
      order: 3,
      defaultValue: '#10b981',
      helpText: 'Color for the status badge',
      showIf: {
        field: 'statusBadgeText',
        operator: 'notEmpty'
      }
    },

    // ========================================================================
    // Details & Content
    // ========================================================================
    {
      name: 'detailsContent',
      label: 'Detailed Content',
      type: 'textarea',
      section: 'details',
      required: true,
      order: 1,
      placeholder: 'Full terms, min/max transfer amounts, processing time, restrictions...',
      helpText: 'Full details shown in overlay (supports markdown)'
    },
    {
      name: 'detailsImages',
      label: 'Detail Images',
      type: 'array',
      section: 'details',
      required: false,
      order: 2,
      arrayItemType: 'text',
      arrayMaxItems: 5,
      helpText: 'Screenshots or proofs (optional, max 5)'
    },
    {
      name: 'ctaUrl',
      label: 'External Link (Optional)',
      type: 'url',
      section: 'details',
      required: false,
      order: 3,
      placeholder: 'https://bank.com/transfer-partners',
      helpText: 'Link to transfer partners page or terms'
    },

    // ========================================================================
    // Settings
    // ========================================================================
    {
      name: 'isVerified',
      label: 'Verified Transfer Bonus',
      type: 'boolean',
      section: 'settings',
      required: false,
      order: 1,
      defaultValue: false,
      helpText: 'Show verification badge (optional for this category)'
    },
    {
      name: 'status',
      label: 'Publication Status',
      type: 'select',
      section: 'settings',
      required: true,
      order: 2,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' }
      ]
    }
  ],
  validationRules: [
    {
      ruleName: 'expiryInFuture',
      errorMessage: 'Expiry date must be in the future',
      fields: ['expiryDateTime'],
      validator: 'validateExpiryInFuture'
    },
    {
      ruleName: 'validTransferRatio',
      errorMessage: 'Transfer ratio values must be valid numbers',
      fields: ['categoryData.transferRatioFrom', 'categoryData.transferRatioTo'],
      validator: 'validateNumericValues'
    },
    {
      ruleName: 'validBonusValue',
      errorMessage: 'Bonus value must be a valid number',
      fields: ['categoryData.bonusValue'],
      validator: 'validateNumericValue'
    }
  ]
}

export const transferBonusRenderConfig: RenderConfig = {
  component: 'TransferBonusCard',
  layout: {
    type: 'card',
    aspectRatio: '16/9',
    gap: '16px'
  },
  elements: {
    header: {
      show: true,
      fields: ['bank.logo', 'isVerified', 'statusBadgeText'],
      layout: 'horizontal'
    },
    title: {
      field: 'categoryData.sourceProgram',
      maxLines: 1,
      fontSize: '1.125rem'
    },
    description: {
      field: 'categoryData.shortDescription',
      maxLines: 3
    },
    badge: {
      valueField: 'categoryData.bonusValue',
      unitField: 'categoryData.bonusUnit',
      colorField: 'categoryData.bonusColor',
      position: 'top-right'
    },
    footer: {
      show: true,
      fields: ['expiryDateTime', 'ctaText']
    }
  },
  theme: {
    borderRadius: '12px',
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
    hoverEffect: 'lift',
    padding: '16px'
  }
}
