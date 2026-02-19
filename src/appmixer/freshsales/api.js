// Auto-generated from OpenAPI spec. Do not edit.

const FetchAllOwners = {
    method: "GET",
    path: "/api/selector/owners",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/owners',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllTerritories = {
    method: "GET",
    path: "/api/selector/territories",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/territories',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDealStages = {
    method: "GET",
    path: "/api/selector/deal_stages",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/deal_stages',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllCurrencies = {
    method: "GET",
    path: "/api/selector/currencies",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/currencies',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDealReasons = {
    method: "GET",
    path: "/api/selector/deal_reasons",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/deal_reasons',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDealTypes = {
    method: "GET",
    path: "/api/selector/deal_types",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/deal_types',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllLeadSources = {
    method: "GET",
    path: "/api/selector/lead_sources",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/lead_sources',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllIndustryTypes = {
    method: "GET",
    path: "/api/selector/industry_types",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/industry_types',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllBusinessTypes = {
    method: "GET",
    path: "/api/selector/business_types",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/business_types',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllCampaigns = {
    method: "GET",
    path: "/api/selector/campaigns",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/campaigns',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDealPaymentStatuses = {
    method: "GET",
    path: "/api/selector/deal_payment_statuses",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/deal_payment_statuses',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDealProducts = {
    method: "GET",
    path: "/api/selector/deal_products",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/deal_products',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDealPipelines = {
    method: "GET",
    path: "/api/selector/deal_pipelines",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/deal_pipelines',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchDealStagesByPipeline = {
    method: "GET",
    path: "/api/selector/deal_pipelines/{id}/deal_stages",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, { id, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/selector/deal_pipelines/${id}/deal_stages`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllContactStatuses = {
    method: "GET",
    path: "/api/selector/contact_statuses",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/contact_statuses',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllSalesActivityTypes = {
    method: "GET",
    path: "/api/selector/sales_activity_types",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/sales_activity_types',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllSalesActivityOutcomes = {
    method: "GET",
    path: "/api/selector/sales_activity_outcomes",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/sales_activity_outcomes',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllSalesActivityEntityTypes = {
    method: "GET",
    path: "/api/selector/sales_activity_entity_types",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/sales_activity_entity_types',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchSalesActivityOutcomesByType = {
    method: "GET",
    path: "/api/selector/sales_activity_types/{id}/sales_activity_outcomes",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, { id, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/selector/sales_activity_types/${id}/sales_activity_outcomes`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const FetchAllDesignations = {
    method: "GET",
    path: "/api/selector/designations",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/selector/designations',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const CreateLead = {
    method: "POST",
    path: "/api/leads",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, { lead, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/leads',
            data: { lead, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ViewLead = {
    method: "GET",
    path: "/api/leads/{id}",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, { id, include, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/leads/${id}`,
            params: { include, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ConvertLead = {
    method: "POST",
    path: "/api/leads/{id}/convert",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, { id, lead, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: `https://developer.freshsales.io/api/leads/${id}/convert`,
            data: { lead, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ListAllLeads = {
    method: "GET",
    path: "/api/leads/view/{view_id}",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, { view_id, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/leads/view/${view_id}`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ListLeadFilters = {
    method: "GET",
    path: "/api/leads/filters",
    docsUrl: "https://developer.freshsales.io/api/",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/leads/filters',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const CreateContact = {
    method: "POST",
    path: "/api/contacts",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, { contact, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/contacts',
            data: { contact, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const GetContact = {
    method: "GET",
    path: "/api/contacts/{id}",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, { id, include, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/contacts/${id}`,
            params: { include, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const rq = (context, { action, url, method = 'GET', data }) => {

    return context.httpRequest({
        method,
        url: `https://${context.domain}${action}`,
        data: { contact, ...rest },
        headers: {
            Authorization: `Bearer ${context.auth.accessToken}`
        }
    });
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
    method: "GET",
    path: "/api/contacts/view/{view_id}",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, { view_id, sort, sort_type, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/contacts/view/${view_id}`,
            params: { sort, sort_type, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ListContactFilters = {
    method: "GET",
    path: "/api/contacts/filters",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/contacts/filters',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ScrollContacts = {
    method: "GET",
    path: "/api/contacts/scroll/{view_id}",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, { view_id, limit, last_fetched_id, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/contacts/scroll/${view_id}`,
            params: { limit, last_fetched_id, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const UpdateContactTeam = {
    method: "POST",
    path: "/api/contacts/{id}/manage_team_members",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, { id, team_users, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: `https://developer.freshsales.io/api/contacts/${id}/manage_team_members`,
            data: { team_users, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const UpsertContact = {
    method: "POST",
    path: "/api/contacts/upsert",
    docsUrl: "https://developer.freshsales.io/api/#contacts",
    async execute(context, { unique_identifier, contact, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/contacts/upsert',
            data: { unique_identifier, contact, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ListAllAppointments = {
    method: "GET",
    path: "/api/appointments",
    docsUrl: "https://developer.freshsales.io/api/#appointments",
    async execute(context, { filter, include, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/appointments',
            params: { filter, include, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const CreateAppointment = {
    method: "POST",
    path: "/api/appointments",
    docsUrl: "https://developer.freshsales.io/api/#appointments",
    async execute(context, { appointment, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/appointments',
            data: { appointment, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ViewAppointment = {
    method: "GET",
    path: "/api/appointments/{appointment_id}",
    docsUrl: "https://developer.freshsales.io/api/#appointments",
    async execute(context, { appointment_id, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/appointments/${appointment_id}`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const UpdateAppointment = {
    method: "PUT",
    path: "/api/appointments/{appointment_id}",
    docsUrl: "https://developer.freshsales.io/api/#appointments",
    async execute(context, { appointment_id, appointment, ...rest }) {
        const response = await context.httpRequest({
            method: 'PUT',
            url: `https://developer.freshsales.io/api/appointments/${appointment_id}`,
            data: { appointment, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const DeleteAppointment = {
    method: "DELETE",
    path: "/api/appointments/{appointment_id}",
    docsUrl: "https://developer.freshsales.io/api/#appointments",
    async execute(context, { appointment_id, ...rest }) {
        const response = await context.httpRequest({
            method: 'DELETE',
            url: `https://developer.freshsales.io/api/appointments/${appointment_id}`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const CreateDeal = {
    method: "POST",
    path: "/api/deals",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { deal, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/deals',
            data: { deal, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ViewDeal = {
    method: "GET",
    path: "/api/deals/{id}",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { id, include, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/deals/${id}`,
            params: { include, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const UpdateDeal = {
    method: "PUT",
    path: "/api/deals/{id}",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { id, deal, ...rest }) {
        const response = await context.httpRequest({
            method: 'PUT',
            url: `https://developer.freshsales.io/api/deals/${id}`,
            data: { deal, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const DeleteDeal = {
    method: "DELETE",
    path: "/api/deals/{id}",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { id, ...rest }) {
        const response = await context.httpRequest({
            method: 'DELETE',
            url: `https://developer.freshsales.io/api/deals/${id}`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ListDealFilters = {
    method: "GET",
    path: "/api/deals/filters",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, input) {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://developer.freshsales.io/api/deals/filters',
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ListAllDeals = {
    method: "GET",
    path: "/api/deals/view/{view_id}",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { view_id, sort, sort_type, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/deals/view/${view_id}`,
            params: { sort, sort_type, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ScrollDeals = {
    method: "GET",
    path: "/api/deals/scroll/{view_id}",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { view_id, limit, last_fetched_id, ...rest }) {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://developer.freshsales.io/api/deals/scroll/${view_id}`,
            params: { limit, last_fetched_id, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const UpdateDealTeam = {
    method: "POST",
    path: "/api/deals/{id}/manage_team_members",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { id, team_users, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: `https://developer.freshsales.io/api/deals/${id}/manage_team_members`,
            data: { team_users, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const UpsertDeal = {
    method: "POST",
    path: "/api/deals/upsert",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { unique_identifier, deal, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/deals/upsert',
            data: { unique_identifier, deal, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const BulkUpsertDeals = {
    method: "POST",
    path: "/api/deals/bulk_upsert",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { deals, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/deals/bulk_upsert',
            data: { deals, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const CloneDeal = {
    method: "POST",
    path: "/api/deals/{id}/clone",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { id, deal, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: `https://developer.freshsales.io/api/deals/${id}/clone`,
            data: { deal, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const ForgetDeal = {
    method: "DELETE",
    path: "/api/deals/{id}/forget",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { id, ...rest }) {
        const response = await context.httpRequest({
            method: 'DELETE',
            url: `https://developer.freshsales.io/api/deals/${id}/forget`,
            params: { ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

const BulkDeleteDeals = {
    method: "POST",
    path: "/api/deals/bulk_destroy",
    docsUrl: "https://developer.freshsales.io/api/#deals",
    async execute(context, { selected_ids, ...rest }) {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://developer.freshsales.io/api/deals/bulk_destroy',
            data: { selected_ids, ...rest },
            headers: {
                Authorization: `Bearer ${context.auth.accessToken}`
            }
        });
        return response.data;
    }
};

module.exports = {
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
