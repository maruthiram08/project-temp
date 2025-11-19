/**
 * Form Schema and Render Config for Lifetime Free Cards category
 */

import { FormSchema, RenderConfig } from '@/types/form-config'

export const lifetimeFreeFormSchema: FormSchema = {
  sections: [
    { id: 'basic', title: 'Basic Information', order: 1 },
    { id: 'card', title: 'Card Appearance', order: 2 },
    { id: 'benefits', title: 'Benefits (Max 2)', order: 3 },
    { id: 'details', title: 'Details & Content', order: 4 },
    { id: 'settings', title: 'Settings', order: 5 }
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
      helpText: 'Select the bank issuing this card'
    },
    {
      name: 'categoryData.cardName',
      label: 'Card Name',
      type: 'text',
      section: 'basic',
      required: true,
      order: 2,
      placeholder: 'e.g., HDFC Millennia Credit Card',
      validation: { max: 100 }
    },
    {
      name: 'categoryData.feeText',
      label: 'Fee Text',
      type: 'text',
      section: 'basic',
      required: true,
      order: 3,
      placeholder: 'e.g., ₹0 annual fee forever',
      validation: { max: 50 },
      helpText: 'Short text about the fee structure'
    },
    {
      name: 'expiryDateTime',
      label: 'Expiry Date (Optional)',
      type: 'datetime',
      section: 'basic',
      required: false,
      order: 4,
      helpText: 'Leave empty if this is an evergreen offer'
    },
    {
      name: 'showExpiryBadge',
      label: 'Show Expiry Badge',
      type: 'boolean',
      section: 'basic',
      required: false,
      order: 5,
      defaultValue: false,
      showIf: {
        field: 'expiryDateTime',
        operator: 'exists'
      }
    },

    // ========================================================================
    // Card Appearance
    // ========================================================================
    {
      name: 'categoryData.cardBackgroundColor',
      label: 'Card Background Color',
      type: 'color',
      section: 'card',
      required: true,
      order: 1,
      defaultValue: '#6366f1',
      helpText: 'Primary background color for the card visual'
    },
    {
      name: 'categoryData.cardBackgroundImage',
      label: 'Card Background Image (Optional)',
      type: 'image',
      section: 'card',
      required: false,
      order: 2,
      accept: 'image/*',
      helpText: 'Optional background pattern or gradient image'
    },

    // ========================================================================
    // Benefits (Max 2)
    // ========================================================================
    {
      name: 'categoryData.benefit1Icon',
      label: 'Benefit 1 Icon',
      type: 'text',
      section: 'benefits',
      required: true,
      order: 1,
      placeholder: 'e.g., 🎁 or icon URL',
      helpText: 'Emoji or icon URL'
    },
    {
      name: 'categoryData.benefit1Text',
      label: 'Benefit 1 Text',
      type: 'text',
      section: 'benefits',
      required: true,
      order: 2,
      placeholder: 'e.g., 5% cashback on online shopping',
      validation: { max: 60 }
    },
    {
      name: 'categoryData.benefit1Color',
      label: 'Benefit 1 Color',
      type: 'color',
      section: 'benefits',
      required: true,
      order: 3,
      defaultValue: '#10b981'
    },
    {
      name: 'categoryData.benefit2Icon',
      label: 'Benefit 2 Icon (Optional)',
      type: 'text',
      section: 'benefits',
      required: false,
      order: 4,
      placeholder: 'e.g., ✈️ or icon URL'
    },
    {
      name: 'categoryData.benefit2Text',
      label: 'Benefit 2 Text (Optional)',
      type: 'text',
      section: 'benefits',
      required: false,
      order: 5,
      placeholder: 'e.g., 2 free airport lounge visits per quarter',
      validation: { max: 60 }
    },
    {
      name: 'categoryData.benefit2Color',
      label: 'Benefit 2 Color',
      type: 'color',
      section: 'benefits',
      required: false,
      order: 6,
      defaultValue: '#f59e0b',
      showIf: {
        field: 'categoryData.benefit2Text',
        operator: 'notEmpty'
      }
    },

    // ========================================================================
    // Application
    // ========================================================================
    {
      name: 'categoryData.applyUrl',
      label: 'Application URL',
      type: 'url',
      section: 'basic',
      required: true,
      order: 10,
      placeholder: 'https://bank.com/apply/card-name',
      helpText: 'External URL where users can apply for this card'
    },
    {
      name: 'ctaText',
      label: 'CTA Button Text',
      type: 'text',
      section: 'settings',
      required: false,
      order: 1,
      defaultValue: 'Apply Free',
      validation: { max: 20 }
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
      placeholder: 'Full card details, eligibility, benefits, terms & conditions...',
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
      helpText: 'Image URLs for the details overlay (optional, max 5)'
    },

    // ========================================================================
    // Settings
    // ========================================================================
    {
      name: 'isVerified',
      label: 'Verified Card',
      type: 'boolean',
      section: 'settings',
      required: false,
      order: 2,
      defaultValue: false,
      helpText: 'Show verification badge'
    },
    {
      name: 'status',
      label: 'Publication Status',
      type: 'select',
      section: 'settings',
      required: true,
      order: 3,
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
      ruleName: 'requireBenefit2ColorIfTextProvided',
      errorMessage: 'Benefit 2 color is required when benefit 2 text is provided',
      fields: ['categoryData.benefit2Text', 'categoryData.benefit2Color'],
      validator: 'validateBenefit2Dependencies'
    }
  ]
}

export const lifetimeFreeRenderConfig: RenderConfig = {
  component: 'LifetimeFreeCard',
  layout: {
    type: 'card',
    aspectRatio: '3/4',
    gap: '16px'
  },
  elements: {
    header: {
      show: true,
      fields: ['bank.logo', 'isVerified'],
      layout: 'horizontal'
    },
    image: {
      field: 'categoryData.cardBackgroundImage',
      type: 'background',
      aspectRatio: '16/9'
    },
    title: {
      field: 'categoryData.cardName',
      maxLines: 2,
      fontSize: '1.25rem'
    },
    description: {
      field: 'categoryData.feeText',
      maxLines: 1
    },
    footer: {
      show: true,
      fields: ['categoryData.applyUrl', 'ctaText']
    }
  },
  theme: {
    borderRadius: '16px',
    shadow: '0 4px 12px rgba(0,0,0,0.15)',
    hoverEffect: 'scale',
    padding: '20px'
  }
}
