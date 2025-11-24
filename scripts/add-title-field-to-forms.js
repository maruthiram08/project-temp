/**
 * Script to add 'title' field to all CardConfig form schemas
 * This allows manual editing of post titles in the review queue
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTitleField() {
    try {
        console.log('🔧 Adding title field to all CardConfig form schemas...\n');

        const configs = await prisma.cardConfig.findMany();

        for (const config of configs) {
            try {
                const schema = JSON.parse(config.formSchema);

                // Check if title field already exists
                const titleFieldExists = schema.fields.some(f => f.name === 'title');

                if (titleFieldExists) {
                    console.log(`✓ ${config.categoryType}: Title field already exists`);
                    continue;
                }

                // Add title field as the first field in the basic section
                const titleField = {
                    name: 'title',
                    label: 'Post Title',
                    type: 'text',
                    section: 'basic',
                    required: true,
                    placeholder: 'Enter post title...',
                    helpText: 'SEO-friendly title for the post',
                    validation: {
                        minLength: 5,
                        maxLength: 200
                    }
                };

                // Add title field at the beginning
                schema.fields.unshift(titleField);

                // Update the config
                await prisma.cardConfig.update({
                    where: { id: config.id },
                    data: {
                        formSchema: JSON.stringify(schema, null, 2)
                    }
                });

                console.log(`✅ ${config.categoryType}: Added title field`);

            } catch (error) {
                console.error(`❌ Error updating ${config.categoryType}:`, error.message);
            }
        }

        console.log('\n✅ All CardConfigs updated successfully!');

    } catch (error) {
        console.error('❌ Script error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addTitleField();
