const rq = (context, { action, method = 'GET', data, params }) => {

    const url = `https://${context.auth.domain}${action}`;
    console.log(url)
    return context.httpRequest({
        method, url, data, params, headers: {
            'Authorization': `Token token=${context.auth.apiKey}`
        }
    });
};

const FetchAllOwners = {
    method: 'GET', path: '/api/selector/owners', docsUrl: 'https://developer.freshsales.io/api/', execute(context) {
        return rq(context, { action: '/api/selector/owners' });
    }
};

const FetchAllTerritories = {
    method: 'GET',
    path: '/api/selector/territories',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/territories' });

    }
};

const FetchAllDealStages = {
    method: 'GET',
    path: '/api/selector/deal_stages',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/deal_stages' });

    }
};

const FetchAllCurrencies = {
    method: 'GET', path: '/api/selector/currencies', docsUrl: 'https://developer.freshsales.io/api/', execute(context) {
        return rq(context, { action: '/api/selector/currencies' });

    }
};

const FetchAllDealReasons = {
    method: 'GET',
    path: '/api/selector/deal_reasons',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/deal_reasons' });

    }
};

const FetchAllDealTypes = {
    method: 'GET', path: '/api/selector/deal_types', docsUrl: 'https://developer.freshsales.io/api/', execute(context) {
        return rq(context, { action: '/api/selector/deal_types' });

    }
};

const FetchAllLeadSources = {
    method: 'GET',
    path: '/api/selector/lead_sources',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/lead_sources' });

    }
};

const FetchAllIndustryTypes = {
    method: 'GET',
    path: '/api/selector/industry_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/industry_types' });

    }
};

const FetchAllBusinessTypes = {
    method: 'GET',
    path: '/api/selector/business_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/business_types' });

    }
};

const FetchAllCampaigns = {
    method: 'GET', path: '/api/selector/campaigns', docsUrl: 'https://developer.freshsales.io/api/', execute(context) {
        return rq(context, { action: '/api/selector/campaigns' });

    }
};

const FetchAllDealPaymentStatuses = {
    method: 'GET',
    path: '/api/selector/deal_payment_statuses',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/deal_payment_statuses' });

    }
};

const FetchAllDealProducts = {
    method: 'GET',
    path: '/api/selector/deal_products',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/deal_products' });

    }
};

const FetchAllDealPipelines = {
    method: 'GET',
    path: '/api/selector/deal_pipelines',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/deal_pipelines' });

    }
};

const FetchDealStagesByPipeline = {
    method: 'GET',
    path: '/api/selector/deal_pipelines/{id}/deal_stages',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context, { id, ...rest }) {
        return rq(context, {
            action: `/api/selector/deal_pipelines/${id}/deal_stages`, params: { ...rest }
        });

    }
};

const FetchAllContactStatuses = {
    method: 'GET',
    path: '/api/selector/contact_statuses',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/contact_statuses' });

    }
};

const FetchAllSalesActivityTypes = {
    method: 'GET',
    path: '/api/selector/sales_activity_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/sales_activity_types' });

    }
};

const FetchAllSalesActivityOutcomes = {
    method: 'GET',
    path: '/api/selector/sales_activity_outcomes',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/sales_activity_outcomes' });

    }
};

const FetchAllSalesActivityEntityTypes = {
    method: 'GET',
    path: '/api/selector/sales_activity_entity_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/sales_activity_entity_types' });

    }
};

const FetchSalesActivityOutcomesByType = {
    method: 'GET',
    path: '/api/selector/sales_activity_types/{id}/sales_activity_outcomes',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context, { id, ...rest }) {
        return rq(context, {
            action: `/api/selector/sales_activity_types/${id}/sales_activity_outcomes`, params: { ...rest }
        });

    }
};

const FetchAllDesignations = {
    method: 'GET',
    path: '/api/selector/designations',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context) {
        return rq(context, { action: '/api/selector/designations' });

    }
};

const CreateLead = {
    method: 'POST',
    path: '/api/leads',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context, { lead, ...rest }) {
        return rq(context, {
            action: '/api/leads', method: 'POST', data: { lead, ...rest }
        });

    }
};

const ViewLead = {
    method: 'GET',
    path: '/api/leads/{id}',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context, { id, include, ...rest }) {
        return rq(context, {
            action: `/api/leads/${id}`, params: { include, ...rest }
        });

    }
};

const ConvertLead = {
    method: 'POST',
    path: '/api/leads/{id}/convert',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context, { id, lead, ...rest }) {
        return rq(context, {
            action: `/api/leads/${id}/convert`, method: 'POST', data: { lead, ...rest }
        });

    }
};

const ListAllLeads = {
    method: 'GET',
    path: '/api/leads/view/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/',
    execute(context, { view_id, ...rest }) {
        return rq(context, {
            action: `/api/leads/view/${view_id}`, params: { ...rest }
        });

    }
};

const ListLeadFilters = {
    method: 'GET', path: '/api/leads/filters', docsUrl: 'https://developer.freshsales.io/api/', execute(context) {
        return rq(context, { action: '/api/leads/filters' });

    }
};

const CreateContact = {
    method: 'POST',
    path: '/api/contacts',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { contact, ...rest }) {
        return rq(context, {
            action: '/api/contacts', method: 'POST', data: { contact, ...rest }
        });

    }
};

const GetContact = {
    method: 'GET',
    path: '/api/contacts/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { id, include, ...rest }) {
        return rq(context, {
            action: `/api/contacts/${id}`, params: { include, ...rest }
        });

    }
};

const UpdateContact = {
    method: 'PUT',
    path: '/api/contacts/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { id, contact, ...rest }) {
        return rq(context, {
            action: `/api/contacts/${id}`, method: 'PUT', data: { contact, ...rest }
        });

    }
};

const ListContactsByView = {
    method: 'GET',
    path: '/api/contacts/view/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { view_id, sort, sort_type, ...rest }) {
        return rq(context, {
            action: `/api/contacts/view/${view_id}`, params: { sort, sort_type, ...rest }
        });

    }
};

const ListContactFilters = {
    method: 'GET',
    path: '/api/contacts/filters',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context) {
        return rq(context, { action: '/api/contacts/filters' });

    }
};

const ScrollContacts = {
    method: 'GET',
    path: '/api/contacts/scroll/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { view_id, limit, last_fetched_id, ...rest }) {
        return rq(context, {
            action: `/api/contacts/scroll/${view_id}`, params: { limit, last_fetched_id, ...rest }
        });

    }
};

const UpdateContactTeam = {
    method: 'POST',
    path: '/api/contacts/{id}/manage_team_members',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { id, team_users, ...rest }) {
        return rq(context, {
            action: `/api/contacts/${id}/manage_team_members`, method: 'POST', data: { team_users, ...rest }
        });

    }
};

const UpsertContact = {
    method: 'POST',
    path: '/api/contacts/upsert',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    execute(context, { unique_identifier, contact, ...rest }) {
        return rq(context, {
            action: '/api/contacts/upsert', method: 'POST', data: { unique_identifier, contact, ...rest }
        });

    }
};

const ListAllAppointments = {
    method: 'GET',
    path: '/api/appointments',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    execute(context, { filter, include, ...rest }) {
        return rq(context, {
            action: '/api/appointments', params: { filter, include, ...rest }
        });

    }
};

const CreateAppointment = {
    method: 'POST',
    path: '/api/appointments',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    execute(context, { appointment, ...rest }) {
        return rq(context, {
            action: '/api/appointments', method: 'POST', data: { appointment, ...rest }
        });

    }
};

const ViewAppointment = {
    method: 'GET',
    path: '/api/appointments/{appointment_id}',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    execute(context, { appointment_id, ...rest }) {
        return rq(context, {
            action: `/api/appointments/${appointment_id}`, params: { ...rest }
        });

    }
};

const UpdateAppointment = {
    method: 'PUT',
    path: '/api/appointments/{appointment_id}',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    execute(context, { appointment_id, appointment, ...rest }) {
        return rq(context, {
            action: `/api/appointments/${appointment_id}`, method: 'PUT', data: { appointment, ...rest }
        });

    }
};

const DeleteAppointment = {
    method: 'DELETE',
    path: '/api/appointments/{appointment_id}',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    execute(context, { appointment_id, ...rest }) {
        return rq(context, {
            action: `/api/appointments/${appointment_id}`, method: 'DELETE', params: { ...rest }
        });

    }
};

const CreateDeal = {
    method: 'POST',
    path: '/api/deals',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { deal, ...rest }) {
        return rq(context, {
            action: '/api/deals', method: 'POST', data: { deal, ...rest }
        });

    }
};

const ViewDeal = {
    method: 'GET',
    path: '/api/deals/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { id, include, ...rest }) {
        return rq(context, {
            action: `/api/deals/${id}`, params: { include, ...rest }
        });

    }
};

const UpdateDeal = {
    method: 'PUT',
    path: '/api/deals/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { id, deal, ...rest }) {
        return rq(context, {
            action: `/api/deals/${id}`, method: 'PUT', data: { deal, ...rest }
        });

    }
};

const DeleteDeal = {
    method: 'DELETE',
    path: '/api/deals/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { id, ...rest }) {
        return rq(context, {
            action: `/api/deals/${id}`, method: 'DELETE', params: { ...rest }
        });

    }
};

const ListDealFilters = {
    method: 'GET', path: '/api/deals/filters', docsUrl: 'https://developer.freshsales.io/api/#deals', execute(context) {
        return rq(context, { action: '/api/deals/filters' });

    }
};

const ListAllDeals = {
    method: 'GET',
    path: '/api/deals/view/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { view_id, sort, sort_type, ...rest }) {
        return rq(context, {
            action: `/api/deals/view/${view_id}`, params: { sort, sort_type, ...rest }
        });

    }
};

const ScrollDeals = {
    method: 'GET',
    path: '/api/deals/scroll/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { view_id, limit, last_fetched_id, ...rest }) {
        return rq(context, {
            action: `/api/deals/scroll/${view_id}`, params: { limit, last_fetched_id, ...rest }
        });

    }
};

const UpdateDealTeam = {
    method: 'POST',
    path: '/api/deals/{id}/manage_team_members',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { id, team_users, ...rest }) {
        return rq(context, {
            action: `/api/deals/${id}/manage_team_members`, method: 'POST', data: { team_users, ...rest }
        });

    }
};

const UpsertDeal = {
    method: 'POST',
    path: '/api/deals/upsert',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { unique_identifier, deal, ...rest }) {
        return rq(context, {
            action: '/api/deals/upsert', method: 'POST', data: { unique_identifier, deal, ...rest }
        });

    }
};

const BulkUpsertDeals = {
    method: 'POST',
    path: '/api/deals/bulk_upsert',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { deals, ...rest }) {
        return rq(context, {
            action: '/api/deals/bulk_upsert', method: 'POST', data: { deals, ...rest }
        });

    }
};

const CloneDeal = {
    method: 'POST',
    path: '/api/deals/{id}/clone',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { id, deal, ...rest }) {
        return rq(context, {
            action: `/api/deals/${id}/clone`, method: 'POST', data: { deal, ...rest }
        });

    }
};

const ForgetDeal = {
    method: 'DELETE',
    path: '/api/deals/{id}/forget',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { id, ...rest }) {
        return rq(context, {
            action: `/api/deals/${id}/forget`, method: 'DELETE', params: { ...rest }
        });

    }
};

const BulkDeleteDeals = {
    method: 'POST',
    path: '/api/deals/bulk_destroy',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    execute(context, { selected_ids, ...rest }) {
        return rq(context, {
            action: '/api/deals/bulk_destroy', method: 'POST', data: { selected_ids, ...rest }
        });

    }
};

module.exports = {
    rq,
    FetchAllOwners,
    FetchAllTerritories,
    FetchAllDealStages,
    FetchAllCurrencies,
    FetchAllDealReasons,
    FetchAllDealTypes,
    FetchAllLeadSources,
    FetchAllIndustryTypes,
    FetchAllBusinessTypes,
    FetchAllCampaigns,
    FetchAllDealPaymentStatuses,
    FetchAllDealProducts,
    FetchAllDealPipelines,
    FetchDealStagesByPipeline,
    FetchAllContactStatuses,
    FetchAllSalesActivityTypes,
    FetchAllSalesActivityOutcomes,
    FetchAllSalesActivityEntityTypes,
    FetchSalesActivityOutcomesByType,
    FetchAllDesignations,
    CreateLead,
    ViewLead,
    ConvertLead,
    ListAllLeads,
    ListLeadFilters,
    CreateContact,
    GetContact,
    UpdateContact,
    ListContactsByView,
    ListContactFilters,
    ScrollContacts,
    UpdateContactTeam,
    UpsertContact,
    ListAllAppointments,
    CreateAppointment,
    ViewAppointment,
    UpdateAppointment,
    DeleteAppointment,
    CreateDeal,
    ViewDeal,
    UpdateDeal,
    DeleteDeal,
    ListDealFilters,
    ListAllDeals,
    ScrollDeals,
    UpdateDealTeam,
    UpsertDeal,
    BulkUpsertDeals,
    CloneDeal,
    ForgetDeal,
    BulkDeleteDeals
};
