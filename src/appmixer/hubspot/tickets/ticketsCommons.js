'use strict';

/**
 * Normalize a raw HubSpot ticket object (id + properties) into a flat object.
 * @param {object} data Raw HubSpot ticket from the CRM API.
 * @returns {object}
 */
function formatTicket(data = {}) {

    const properties = data.properties || {};

    return {
        id: data.id,
        subject: properties.subject || '',
        content: properties.content || '',
        pipeline: properties.hs_pipeline || '',
        stage: properties.hs_pipeline_stage || '',
        priority: properties.hs_ticket_priority || '',
        ownerId: properties.hubspot_owner_id || '',
        category: properties.hs_ticket_category || '',
        createdAt: properties.createdate || data.createdAt || '',
        updatedAt: properties.hs_lastmodifieddate || data.updatedAt || ''
    };
}

// JSON schema of a single normalized ticket. Used to build output port options.
const TICKET_SCHEMA = {
    id: { type: 'string', title: 'Ticket ID', example: '1846987684' },
    subject: { type: 'string', title: 'Subject', example: 'Cannot log in' },
    content: { type: 'string', title: 'Content', example: 'The user is unable to log in to the portal.' },
    pipeline: { type: 'string', title: 'Pipeline', example: '0' },
    stage: { type: 'string', title: 'Stage', example: '1' },
    priority: { type: 'string', title: 'Priority', example: 'HIGH' },
    ownerId: { type: 'string', title: 'Owner ID', example: '41629779' },
    category: { type: 'string', title: 'Category', example: 'GENERAL_INQUIRY' },
    createdAt: { type: 'string', title: 'Created At', example: '2024-01-15T09:30:00.000Z' },
    updatedAt: { type: 'string', title: 'Updated At', example: '2024-01-16T11:45:00.000Z' }
};

module.exports = { formatTicket, TICKET_SCHEMA };
