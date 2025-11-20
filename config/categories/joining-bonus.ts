/**
 * Form Schema and Render Config for Joining Bonus category
 */

import { FormSchema, RenderConfig } from '@/types/form-config'

export const joiningBonusFormSchema: FormSchema = {
  sections: [
    { id: 'basic', title: 'Basic Information', order: 1 },
    { id: 'visual', title: 'Card Visual', order: 2 },
    { id: 'savings', title: 'Savings Configuration', order: 3 },
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
      helpText: 'Select the bank offering this joining bonus'
    },
    {
      name: 'categoryData.cardName',
      label: 'Card Name',
      type: 'text',
      section: 'basic',
      required: true,
      order: 2,
      placeholder: 'e.g., Axis Magnus Credit Card',
      validation: { max: 100 }
    },
    {
      name: 'categoryData.shortDescription',
      label: 'Short Description',
      type: 'textarea',
      section: 'basic',
      required: true,
      order: 3,
      placeholder: 'e.g., Get 25,000 bonus points on spending ₹1,00,000 within 60 days',
      validation: { max: 200 },
      helpText: 'Brief description of the joining bonus (max 200 characters)'
    },
    {
      name: 'expiryDateTime',
      label: 'Expiry Date & Time',
      type: 'datetime',
      section: 'basic',
      required: true,
      order: 4,
      helpText: 'When this joining bonus expires (always required)'
    },
    {
      name: 'expiryDisplayFormat',
      label: 'Expiry Display Format',
      type: 'select',
      section: 'basic',
      required: true,
      order: 5,
      defaultValue: 'date',
      options: [
        { label: 'Date Only', value: 'date' },
        { label: 'Countdown Only', value: 'countdown' },
        { label: 'Both Date and Countdown', value: 'both' }
      ],
      helpText: 'How to display the expiry on the card'
    },

    // ========================================================================
    // Card Visual
    // ========================================================================
    {
      name: 'categoryData.cardVisualImage',
      label: 'Card Visual Image',
      type: 'image',
      section: 'visual',
      required: true,
      order: 1,
      accept: 'image/*',
      helpText: 'Hero image of the credit card (required)'
    },
    {
      name: 'categoryData.cardVisualAlt',
      label: 'Card Image Alt Text',
      type: 'text',
      section: 'visual',
      required: false,
      order: 2,
      placeholder: 'e.g., Axis Magnus Credit Card',
      validation: { max: 100 },
      helpText: 'Alt text for accessibility'
    },

    // ========================================================================
    // Savings Configuration
    // ========================================================================
    {
      name: 'categoryData.savingsValue',
      label: 'Savings Value',
      type: 'text',
      section: 'savings',
      required: true,
      order: 1,
      placeholder: 'e.g., 10000',
      helpText: 'Numeric value of the bonus/savings'
    },
    {
      name: 'categoryData.savingsUnit',
      label: 'Savings Unit',
      type: 'select',
      section: 'savings',
      required: true,
      order: 2,
      options: [
        { label: 'Rupees (₹)', value: '₹' },
        { label: 'Points (pts)', value: 'pts' },
        { label: 'Miles', value: 'miles' },
        { label: 'Percentage (%)', value: '%' }
      ],
      helpText: 'Unit of the savings value'
    },
    {
      name: 'categoryData.savingsColor',
      label: 'Badge Color',
      type: 'color',
      section: 'savings',
      required: true,
      order: 3,
      defaultValue: '#ef4444',
      helpText: 'Background color for the savings badge'
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
      placeholder: 'Full terms: spend requirements, timeline, point value, how to claim...',
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
      helpText: 'Additional images for the details overlay (optional, max 5)'
    },
    {
      name: 'ctaUrl',
      label: 'Application/Details URL',
      type: 'url',
      section: 'details',
      required: false,
      order: 3,
      placeholder: 'https://bank.com/apply/card-name',
      helpText: 'External link to apply or learn more'
    },

    // ========================================================================
    // Settings
    // ========================================================================
    {
      name: 'isVerified',
      label: 'Verified Bonus',
      type: 'boolean',
      section: 'settings',
      required: false,
      order: 1,
      defaultValue: false,
      helpText: 'Show verification badge'
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
      ruleName: 'validSavingsValue',
      errorMessage: 'Savings value must be a valid number',
      fields: ['categoryData.savingsValue'],
      validator: 'validateSingleNumericValue'
    },
    {
      ruleName: 'requiredCardVisual',
      errorMessage: 'Card visual image is required for Joining Bonus',
      fields: ['categoryData.cardVisualImage'],
      validator: 'validateSingleRequired'
    }
  ]
}

export const joiningBonusRenderConfig: RenderConfig = {
  component: 'JoiningBonusCard',
  layout: {
    type: 'card',
    aspectRatio: '4/5',
    gap: '16px'
  },
  elements: {
    header: {
      show: true,
      fields: ['bank.logo', 'isVerified'],
      layout: 'horizontal'
    },
    image: {
      field: 'categoryData.cardVisualImage',
      type: 'hero',
      aspectRatio: '16/10'
    },
    title: {
      field: 'categoryData.cardName',
      maxLines: 2,
      fontSize: '1.25rem'
    },
    description: {
      field: 'categoryData.shortDescription',
      maxLines: 3
    },
    badge: {
      valueField: 'categoryData.savingsValue',
      unitField: 'categoryData.savingsUnit',
      colorField: 'categoryData.savingsColor',
      position: 'top-right'
    },
    footer: {
      show: true,
      fields: ['expiryDateTime', 'ctaText']
    }
  },
  theme: {
    borderRadius: '16px',
    shadow: '0 4px 12px rgba(0,0,0,0.15)',
    hoverEffect: 'lift',
    padding: '20px'
  }
}
