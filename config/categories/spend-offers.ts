/**
 * Form Schema and Render Config for Spend Offers category
 */

import { FormSchema, RenderConfig } from '@/types/form-config'

export const spendOffersFormSchema: FormSchema = {
  sections: [
    { id: 'basic', title: 'Basic Information', order: 1 },
    { id: 'value', title: 'Value Back Configuration', order: 2 },
    { id: 'details', title: 'Details & Content', order: 3 },
    { id: 'settings', title: 'Settings', order: 4 }
  ],
  fields: [
    // ========================================================================
    // Basic Information Section
    // ========================================================================
    {
      name: 'bankId',
      label: 'Bank',
      type: 'select',
      section: 'basic',
      required: true,
      order: 1,
      helpText: 'Select the bank offering this deal'
    },
    {
      name: 'categoryData.offerTitle',
      label: 'Offer Title',
      type: 'text',
      section: 'basic',
      required: true,
      order: 2,
      placeholder: 'e.g., 10% off on dining at participating restaurants',
      validation: { max: 100 },
      helpText: 'Short, catchy title for the offer'
    },
    {
      name: 'categoryData.shortDescription',
      label: 'Short Description',
      type: 'textarea',
      section: 'basic',
      required: true,
      order: 3,
      placeholder: 'e.g., Get 10% cashback on all dining transactions with no minimum spend',
      validation: { max: 200 },
      helpText: 'Brief description shown on the card (max 200 characters)'
    },
    {
      name: 'expiryDateTime',
      label: 'Expiry Date & Time',
      type: 'datetime',
      section: 'basic',
      required: true,
      order: 4,
      helpText: 'When this offer expires (always required for Spend Offers)'
    },
    {
      name: 'showExpiryBadge',
      label: 'Show Expiry Badge',
      type: 'boolean',
      section: 'basic',
      required: false,
      order: 5,
      defaultValue: true,
      helpText: 'Display countdown or date on the card'
    },

    // ========================================================================
    // Value Back Configuration
    // ========================================================================
    {
      name: 'categoryData.valueBackValue',
      label: 'Value Back Amount',
      type: 'text',
      section: 'value',
      required: true,
      order: 1,
      placeholder: 'e.g., 10, 500, 5x',
      helpText: 'The numeric value (can include "x" for multipliers)'
    },
    {
      name: 'categoryData.valueBackUnit',
      label: 'Value Back Unit',
      type: 'select',
      section: 'value',
      required: true,
      order: 2,
      options: [
        { label: 'Percentage (%)', value: '%' },
        { label: 'Rupees (₹)', value: '₹' },
        { label: 'Points (pts)', value: 'pts' },
        { label: 'Multiplier (x)', value: 'x' }
      ],
      helpText: 'Unit of value back'
    },
    {
      name: 'categoryData.valueBackColor',
      label: 'Badge Color',
      type: 'color',
      section: 'value',
      required: true,
      order: 3,
      defaultValue: '#10b981',
      helpText: 'Background color for the value back badge'
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
      placeholder: 'Full terms and conditions, eligibility criteria, how to claim, etc.',
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
      name: 'ctaUrl',
      label: 'CTA URL',
      type: 'url',
      section: 'settings',
      required: false,
      order: 1,
      placeholder: 'https://example.com/offer-details',
      helpText: 'External link (optional). If empty, opens overlay'
    },
    {
      name: 'isVerified',
      label: 'Verified Offer',
      type: 'boolean',
      section: 'settings',
      required: false,
      order: 2,
      defaultValue: false,
      helpText: 'Show verification badge on the card'
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
      ruleName: 'expiryInFuture',
      errorMessage: 'Expiry date must be in the future',
      fields: ['expiryDateTime'],
      validator: 'validateExpiryInFuture'
    },
    {
      ruleName: 'validValueBackValue',
      errorMessage: 'Value back amount must be a valid number or multiplier (e.g., 10, 5x)',
      fields: ['categoryData.valueBackValue'],
      validator: 'validateValueBackValue'
    }
  ]
}

export const spendOffersRenderConfig: RenderConfig = {
  component: 'SpendOfferCard',
  layout: {
    type: 'card',
    aspectRatio: '16/9',
    gap: '16px'
  },
  elements: {
    header: {
      show: true,
      fields: ['bank.logo', 'isVerified'],
      layout: 'horizontal'
    },
    title: {
      field: 'categoryData.offerTitle',
      maxLines: 2,
      fontSize: '1.25rem'
    },
    description: {
      field: 'categoryData.shortDescription',
      maxLines: 3
    },
    badge: {
      valueField: 'categoryData.valueBackValue',
      unitField: 'categoryData.valueBackUnit',
      colorField: 'categoryData.valueBackColor',
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
