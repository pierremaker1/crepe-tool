export type Lang = 'fr' | 'en'

export const translations = {
  fr: {
    appName: 'Crêpe Tool',
    dashboard: 'Tableau de bord',
    totalProspects: 'Total prospects',
    visitsToday: "Visites aujourd'hui",
    toFollowUp: 'À relancer',
    meetingsBooked: 'RDV décrochés',
    visitsTodaySection: "Visites aujourd'hui",
    noProspects: "Aucun prospect pour l'instant",
    noProspectsHint: 'Appuyez sur + pour ajouter votre premier prospect',
    loading: 'Chargement...',
    back: '←',
    newProspect: 'Nouveau prospect',
    prospectNotFound: 'Prospect introuvable',
    goBack: 'Retour',

    // Form sections
    infoSection: 'Informations',
    googleSection: 'Google',
    websiteSection: 'Site web',
    statusSection: 'Statut',
    visitSection: 'Visite',

    // Form fields
    businessName: "Nom de l'établissement *",
    ownerName: 'Gérant (prénom et nom)',
    address: 'Adresse',
    city: 'Ville',
    phone: 'Téléphone',
    googleRating: 'Note Google',
    googleReviews: 'Nb avis',
    visitDate: 'Date de visite',
    today: "Aujourd'hui",
    visitNotes: 'Notes de visite',
    visitNotesPlaceholder: 'Résumé du passage...',
    pitchArgument: 'Argument de vente',
    pitchPlaceholder: 'Principal argument pour ce prospect...',

    // Buttons
    save: 'Enregistrer les modifications',
    addProspect: 'Ajouter le prospect',
    saving: 'Enregistrement...',
    delete: 'Supprimer ce prospect',
    deleteConfirm: 'Confirmer la suppression',
    deleting: 'Suppression...',
    cancel: 'Annuler',

    // Status
    status: {
      to_visit: 'À visiter',
      not_interested: 'Non intéressé',
      to_follow_up: 'À relancer',
      meeting_booked: 'RDV décroché',
      client: 'Client',
    },

    // Website status
    websiteStatus: {
      none: 'Aucun site',
      bad: 'Site nul',
      correct: 'Site correct',
      good: 'Bon site',
    },

    // Errors
    nameRequired: 'Le nom est obligatoire',
    saveError: 'Erreur lors de la sauvegarde',
    deleteError: 'Erreur lors de la suppression',
  },

  en: {
    appName: 'Crêpe Tool',
    dashboard: 'Dashboard',
    totalProspects: 'Total prospects',
    visitsToday: "Today's visits",
    toFollowUp: 'To follow up',
    meetingsBooked: 'Meetings booked',
    visitsTodaySection: "Today's visits",
    noProspects: 'No prospects yet',
    noProspectsHint: 'Tap + to add your first prospect',
    loading: 'Loading...',
    back: '←',
    newProspect: 'New prospect',
    prospectNotFound: 'Prospect not found',
    goBack: 'Go back',

    infoSection: 'Info',
    googleSection: 'Google',
    websiteSection: 'Website',
    statusSection: 'Status',
    visitSection: 'Visit',

    businessName: 'Business name *',
    ownerName: 'Owner (first & last name)',
    address: 'Address',
    city: 'City',
    phone: 'Phone',
    googleRating: 'Google rating',
    googleReviews: 'Reviews count',
    visitDate: 'Visit date',
    today: 'Today',
    visitNotes: 'Visit notes',
    visitNotesPlaceholder: 'Summary of the visit...',
    pitchArgument: 'Sales argument',
    pitchPlaceholder: 'Main pitch for this prospect...',

    save: 'Save changes',
    addProspect: 'Add prospect',
    saving: 'Saving...',
    delete: 'Delete prospect',
    deleteConfirm: 'Confirm deletion',
    deleting: 'Deleting...',
    cancel: 'Cancel',

    status: {
      to_visit: 'To visit',
      not_interested: 'Not interested',
      to_follow_up: 'Follow up',
      meeting_booked: 'Meeting booked',
      client: 'Client',
    },

    websiteStatus: {
      none: 'No website',
      bad: 'Bad website',
      correct: 'OK website',
      good: 'Good website',
    },

    nameRequired: 'Name is required',
    saveError: 'Error saving',
    deleteError: 'Error deleting',
  },
} as const

export type Translations = typeof translations[Lang]
