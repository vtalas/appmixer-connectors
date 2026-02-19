const rq = (context, { action, method = 'GET', data, params }) => {

    return context.httpRequest({
        method,
        url: `https://${context.domain}${action}`,
        data,
        params,
        headers: {
            Authorization: `Bearer ${context.auth.accessToken}`
        }
    });
};

const FetchAllOwners = {
    method: 'GET',
    path: '/api/selector/owners',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/owners' });
        return data;
    }
};

const FetchAllTerritories = {
    method: 'GET',
    path: '/api/selector/territories',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/territories' });
        return data;
    }
};

const FetchAllDealStages = {
    method: 'GET',
    path: '/api/selector/deal_stages',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/deal_stages' });
        return data;
    }
};

const FetchAllCurrencies = {
    method: 'GET',
    path: '/api/selector/currencies',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/currencies' });
        return data;
    }
};

const FetchAllDealReasons = {
    method: 'GET',
    path: '/api/selector/deal_reasons',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/deal_reasons' });
        return data;
    }
};

const FetchAllDealTypes = {
    method: 'GET',
    path: '/api/selector/deal_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/deal_types' });
        return data;
    }
};

const FetchAllLeadSources = {
    method: 'GET',
    path: '/api/selector/lead_sources',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/lead_sources' });
        return data;
    }
};

const FetchAllIndustryTypes = {
    method: 'GET',
    path: '/api/selector/industry_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/industry_types' });
        return data;
    }
};

const FetchAllBusinessTypes = {
    method: 'GET',
    path: '/api/selector/business_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/business_types' });
        return data;
    }
};

const FetchAllCampaigns = {
    method: 'GET',
    path: '/api/selector/campaigns',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/campaigns' });
        return data;
    }
};

const FetchAllDealPaymentStatuses = {
    method: 'GET',
    path: '/api/selector/deal_payment_statuses',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/deal_payment_statuses' });
        return data;
    }
};

const FetchAllDealProducts = {
    method: 'GET',
    path: '/api/selector/deal_products',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/deal_products' });
        return data;
    }
};

const FetchAllDealPipelines = {
    method: 'GET',
    path: '/api/selector/deal_pipelines',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/deal_pipelines' });
        return data;
    }
};

const FetchDealStagesByPipeline = {
    method: 'GET',
    path: '/api/selector/deal_pipelines/{id}/deal_stages',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context, { id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/selector/deal_pipelines/${id}/deal_stages`,
            params: { ...rest }
        });
        return data;
    }
};

const FetchAllContactStatuses = {
    method: 'GET',
    path: '/api/selector/contact_statuses',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/contact_statuses' });
        return data;
    }
};

const FetchAllSalesActivityTypes = {
    method: 'GET',
    path: '/api/selector/sales_activity_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/sales_activity_types' });
        return data;
    }
};

const FetchAllSalesActivityOutcomes = {
    method: 'GET',
    path: '/api/selector/sales_activity_outcomes',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/sales_activity_outcomes' });
        return data;
    }
};

const FetchAllSalesActivityEntityTypes = {
    method: 'GET',
    path: '/api/selector/sales_activity_entity_types',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/sales_activity_entity_types' });
        return data;
    }
};

const FetchSalesActivityOutcomesByType = {
    method: 'GET',
    path: '/api/selector/sales_activity_types/{id}/sales_activity_outcomes',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context, { id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/selector/sales_activity_types/${id}/sales_activity_outcomes`,
            params: { ...rest }
        });
        return data;
    }
};

const FetchAllDesignations = {
    method: 'GET',
    path: '/api/selector/designations',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/selector/designations' });
        return data;
    }
};

const CreateLead = {
    method: 'POST',
    path: '/api/leads',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context, { lead, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/leads',
            method: 'POST',
            data: { lead, ...rest }
        });
        return data;
    }
};

const ViewLead = {
    method: 'GET',
    path: '/api/leads/{id}',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context, { id, include, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/leads/${id}`,
            params: { include, ...rest }
        });
        return data;
    }
};

const ConvertLead = {
    method: 'POST',
    path: '/api/leads/{id}/convert',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context, { id, lead, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/leads/${id}/convert`,
            method: 'POST',
            data: { lead, ...rest }
        });
        return data;
    }
};

const ListAllLeads = {
    method: 'GET',
    path: '/api/leads/view/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context, { view_id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/leads/view/${view_id}`,
            params: { ...rest }
        });
        return data;
    }
};

const ListLeadFilters = {
    method: 'GET',
    path: '/api/leads/filters',
    docsUrl: 'https://developer.freshsales.io/api/',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/leads/filters' });
        return data;
    }
};

const CreateContact = {
    method: 'POST',
    path: '/api/contacts',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { contact, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/contacts',
            method: 'POST',
            data: { contact, ...rest }
        });
        return data;
    }
};

const GetContact = {
    method: 'GET',
    path: '/api/contacts/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { id, include, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/contacts/${id}`,
            params: { include, ...rest }
        });
        return data;
    }
};

const UpdateContact = {
    method: 'PUT',
    path: '/api/contacts/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { id, contact, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/contacts/${id}`,
            method: 'PUT',
            data: { contact, ...rest }
        });
        return data;
    }
};

const ListContactsByView = {
    method: 'GET',
    path: '/api/contacts/view/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { view_id, sort, sort_type, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/contacts/view/${view_id}`,
            params: { sort, sort_type, ...rest }
        });
        return data;
    }
};

const ListContactFilters = {
    method: 'GET',
    path: '/api/contacts/filters',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/contacts/filters' });
        return data;
    }
};

const ScrollContacts = {
    method: 'GET',
    path: '/api/contacts/scroll/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { view_id, limit, last_fetched_id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/contacts/scroll/${view_id}`,
            params: { limit, last_fetched_id, ...rest }
        });
        return data;
    }
};

const UpdateContactTeam = {
    method: 'POST',
    path: '/api/contacts/{id}/manage_team_members',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { id, team_users, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/contacts/${id}/manage_team_members`,
            method: 'POST',
            data: { team_users, ...rest }
        });
        return data;
    }
};

const UpsertContact = {
    method: 'POST',
    path: '/api/contacts/upsert',
    docsUrl: 'https://developer.freshsales.io/api/#contacts',
    async execute(context, { unique_identifier, contact, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/contacts/upsert',
            method: 'POST',
            data: { unique_identifier, contact, ...rest }
        });
        return data;
    }
};

const ListAllAppointments = {
    method: 'GET',
    path: '/api/appointments',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    async execute(context, { filter, include, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/appointments',
            params: { filter, include, ...rest }
        });
        return data;
    }
};

const CreateAppointment = {
    method: 'POST',
    path: '/api/appointments',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    async execute(context, { appointment, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/appointments',
            method: 'POST',
            data: { appointment, ...rest }
        });
        return data;
    }
};

const ViewAppointment = {
    method: 'GET',
    path: '/api/appointments/{appointment_id}',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    async execute(context, { appointment_id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/appointments/${appointment_id}`,
            params: { ...rest }
        });
        return data;
    }
};

const UpdateAppointment = {
    method: 'PUT',
    path: '/api/appointments/{appointment_id}',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    async execute(context, { appointment_id, appointment, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/appointments/${appointment_id}`,
            method: 'PUT',
            data: { appointment, ...rest }
        });
        return data;
    }
};

const DeleteAppointment = {
    method: 'DELETE',
    path: '/api/appointments/{appointment_id}',
    docsUrl: 'https://developer.freshsales.io/api/#appointments',
    async execute(context, { appointment_id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/appointments/${appointment_id}`,
            method: 'DELETE',
            params: { ...rest }
        });
        return data;
    }
};

const CreateDeal = {
    method: 'POST',
    path: '/api/deals',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { deal, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/deals',
            method: 'POST',
            data: { deal, ...rest }
        });
        return data;
    }
};

const ViewDeal = {
    method: 'GET',
    path: '/api/deals/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { id, include, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/${id}`,
            params: { include, ...rest }
        });
        return data;
    }
};

const UpdateDeal = {
    method: 'PUT',
    path: '/api/deals/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { id, deal, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/${id}`,
            method: 'PUT',
            data: { deal, ...rest }
        });
        return data;
    }
};

const DeleteDeal = {
    method: 'DELETE',
    path: '/api/deals/{id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/${id}`,
            method: 'DELETE',
            params: { ...rest }
        });
        return data;
    }
};

const ListDealFilters = {
    method: 'GET',
    path: '/api/deals/filters',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context) {
        const { data } = await rq(context, { action: '/api/deals/filters' });
        return data;
    }
};

const ListAllDeals = {
    method: 'GET',
    path: '/api/deals/view/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { view_id, sort, sort_type, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/view/${view_id}`,
            params: { sort, sort_type, ...rest }
        });
        return data;
    }
};

const ScrollDeals = {
    method: 'GET',
    path: '/api/deals/scroll/{view_id}',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { view_id, limit, last_fetched_id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/scroll/${view_id}`,
            params: { limit, last_fetched_id, ...rest }
        });
        return data;
    }
};

const UpdateDealTeam = {
    method: 'POST',
    path: '/api/deals/{id}/manage_team_members',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { id, team_users, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/${id}/manage_team_members`,
            method: 'POST',
            data: { team_users, ...rest }
        });
        return data;
    }
};

const UpsertDeal = {
    method: 'POST',
    path: '/api/deals/upsert',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { unique_identifier, deal, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/deals/upsert',
            method: 'POST',
            data: { unique_identifier, deal, ...rest }
        });
        return data;
    }
};

const BulkUpsertDeals = {
    method: 'POST',
    path: '/api/deals/bulk_upsert',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { deals, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/deals/bulk_upsert',
            method: 'POST',
            data: { deals, ...rest }
        });
        return data;
    }
};

const CloneDeal = {
    method: 'POST',
    path: '/api/deals/{id}/clone',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { id, deal, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/${id}/clone`,
            method: 'POST',
            data: { deal, ...rest }
        });
        return data;
    }
};

const ForgetDeal = {
    method: 'DELETE',
    path: '/api/deals/{id}/forget',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { id, ...rest }) {
        const { data } = await rq(context, {
            action: `/api/deals/${id}/forget`,
            method: 'DELETE',
            params: { ...rest }
        });
        return data;
    }
};

const BulkDeleteDeals = {
    method: 'POST',
    path: '/api/deals/bulk_destroy',
    docsUrl: 'https://developer.freshsales.io/api/#deals',
    async execute(context, { selected_ids, ...rest }) {
        const { data } = await rq(context, {
            action: '/api/deals/bulk_destroy',
            method: 'POST',
            data: { selected_ids, ...rest }
        });
        return data;
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
