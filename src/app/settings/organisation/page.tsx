"use client";

import React from 'react';
import { OrganisationView } from '@/components/settings/OrganisationView';
import { INITIAL_ORGANIZATION } from '@/lib/data';

export default function OrganisationPage() {
    return <OrganisationView currentOrg={INITIAL_ORGANIZATION} />;
}
