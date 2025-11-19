/**
 * Form Schema and Render Config for Stacking Hacks category
 */

import { FormSchema, RenderConfig } from '@/types/form-config'

export const stackingHacksFormSchema: FormSchema = {
  sections: [
    { id: 'basic', title: 'Basic Information', order: 1 },
    { id: 'rewards', title: 'Reward Breakdown', order: 2 },
    { id: 'visual', title: 'Visual & Attribution', order: 3 },
    { id: 'details', title: 'Details & Content', order: 4 },
    { id: 'settings', title: 'Settings', order: 5 }
  ],
  fields: [
    // ========================================================================
    // Basic Information
    // ========================================================================
    {
      name: 'categoryData.stackTitle',
      label: 'Stack Title',
      type: 'text',
      section: 'basic',
      required: true,
      order: 1,
      placeholder: 'e.g., Triple Stack: Amazon Gift Card via Gyftr',
      validation: { max: 120 },
      helpText: 'Descriptive title explaining the stacking strategy'
    },
    {
      name: 'categoryData.categoryLabel',
      label: 'Category Label',
      type: 'select',
      section: 'basic',
      required: true,
      order: 2,
      options: [
        { label: 'Dining', value: 'Dining' },
        { label: 'Shopping', value: 'Shopping' },
        { label: 'Travel', value: 'Travel' },
        { label: 'Fuel', value: 'Fuel' },
        { label: 'Groceries', value: 'Groceries' },
        { label: 'Online Shopping', value: 'Online Shopping' },
        { label: 'Gift Cards', value: 'Gift Cards' },
        { label: 'Other', value: 'Other' }
      ],
      helpText: 'Primary category for this stack'
    },
    {
      name: 'categoryData.stackTypeTags',
      label: 'Stack Type Tags',
      type: 'multiselect',
      section: 'basic',
      required: true,
      order: 3,
      options: [
        { label: 'Cashback', value: 'Cashback' },
        { label: 'Points', value: 'Points' },
        { label: 'Miles', value: 'Miles' },
        { label: 'Discount', value: 'Discount' },
        { label: 'Accelerated', value: 'Accelerated' },
        { label: 'Bonus', value: 'Bonus' }
      ],
      helpText: 'Tags describing the reward types (select multiple)'
    },

    // ========================================================================
    // Reward Breakdown
    // ========================================================================
    {
      name: 'categoryData.mainRewardValue',
      label: 'Main Reward Value',
      type: 'text',
      section: 'rewards',
      required: true,
      order: 1,
      placeholder: 'e.g., 15',
      helpText: 'Total combined reward value'
    },
    {
      name: 'categoryData.mainRewardUnit',
      label: 'Main Reward Unit',
      type: 'select',
      section: 'rewards',
      required: true,
      order: 2,
      options: [
        { label: 'Percentage (%)', value: '%' },
        { label: 'Rupees (₹)', value: '₹' },
        { label: 'Points (pts)', value: 'pts' },
        { label: 'Miles', value: 'miles' },
        { label: 'Multiplier (x)', value: 'x' }
      ]
    },
    {
      name: 'categoryData.extraSavingValue',
      label: 'Extra Saving Value',
      type: 'text',
      section: 'rewards',
      required: true,
      order: 3,
      placeholder: 'e.g., 10',
      helpText: 'Additional reward from stacking'
    },
    {
      name: 'categoryData.extraSavingUnit',
      label: 'Extra Saving Unit',
      type: 'select',
      section: 'rewards',
      required: true,
      order: 4,
      options: [
        { label: 'Percentage (%)', value: '%' },
        { label: 'Rupees (₹)', value: '₹' },
        { label: 'Points (pts)', value: 'pts' },
        { label: 'Miles', value: 'miles' },
        { label: 'Multiplier (x)', value: 'x' }
      ]
    },
    {
      name: 'categoryData.baseRateValue',
      label: 'Base Rate Value',
      type: 'text',
      section: 'rewards',
      required: true,
      order: 5,
      placeholder: 'e.g., 5',
      helpText: 'Base reward without stacking'
    },
    {
      name: 'categoryData.baseRateUnit',
      label: 'Base Rate Unit',
      type: 'select',
      section: 'rewards',
      required: true,
      order: 6,
      options: [
        { label: 'Percentage (%)', value: '%' },
        { label: 'Rupees (₹)', value: '₹' },
        { label: 'Points (pts)', value: 'pts' },
        { label: 'Miles', value: 'miles' },
        { label: 'Multiplier (x)', value: 'x' }
      ]
    },

    // ========================================================================
    // Visual & Attribution
    // ========================================================================
    {
      name: 'categoryData.bannerImage',
      label: 'Banner Image (Optional)',
      type: 'image',
      section: 'visual',
      required: false,
      order: 1,
      accept: 'image/*',
      helpText: 'Visual banner for the stack (optional)'
    },
    {
      name: 'categoryData.authorName',
      label: 'Author Name (Optional)',
      type: 'text',
      section: 'visual',
      required: false,
      order: 2,
      placeholder: 'e.g., John Doe',
      validation: { max: 50 },
      helpText: 'Credit the person who discovered/shared this stack'
    },
    {
      name: 'categoryData.authorHandle',
      label: 'Author Handle (Optional)',
      type: 'text',
      section: 'visual',
      required: false,
      order: 3,
      placeholder: 'e.g., @johndoe',
      validation: { max: 30 }
    },
    {
      name: 'categoryData.authorPlatform',
      label: 'Author Platform (Optional)',
      type: 'select',
      section: 'visual',
      required: false,
      order: 4,
      options: [
        { label: 'Twitter', value: 'twitter' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Reddit', value: 'reddit' },
        { label: 'Other', value: 'other' }
      ],
      showIf: {
        field: 'categoryData.authorHandle',
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
      placeholder: 'Step-by-step guide, card combinations, calculations, tips...',
      helpText: 'Full stacking strategy shown in overlay (supports markdown)'
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
      helpText: 'Screenshots, diagrams, or proof (optional, max 5)'
    },
    {
      name: 'ctaUrl',
      label: 'External Link (Optional)',
      type: 'url',
      section: 'details',
      required: false,
      order: 3,
      placeholder: 'https://example.com/full-guide',
      helpText: 'Link to full guide or related content'
    },

    // ========================================================================
    // Settings
    // ========================================================================
    {
      name: 'status',
      label: 'Publication Status',
      type: 'select',
      section: 'settings',
      required: true,
      order: 1,
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
      ruleName: 'validRewardValues',
      errorMessage: 'All reward values must be valid numbers',
      fields: ['categoryData.mainRewardValue', 'categoryData.extraSavingValue', 'categoryData.baseRateValue'],
      validator: 'validateNumericValues'
    }
  ]
}

export const stackingHacksRenderConfig: RenderConfig = {
  component: 'StackingHackCard',
  layout: {
    type: 'card',
    aspectRatio: '16/10',
    gap: '16px'
  },
  elements: {
    header: {
      show: true,
      fields: ['categoryData.categoryLabel', 'categoryData.stackTypeTags'],
      layout: 'horizontal'
    },
    title: {
      field: 'categoryData.stackTitle',
      maxLines: 2,
      fontSize: '1.25rem'
    },
    image: {
      field: 'categoryData.bannerImage',
      type: 'banner',
      aspectRatio: '21/9'
    },
    badge: {
      valueField: 'categoryData.mainRewardValue',
      unitField: 'categoryData.mainRewardUnit',
      colorField: '#8b5cf6',
      position: 'top-right'
    },
    footer: {
      show: true,
      fields: ['categoryData.authorName', 'ctaText']
    }
  },
  theme: {
    borderRadius: '12px',
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
    hoverEffect: 'glow',
    padding: '16px'
  }
}
