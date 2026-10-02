<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div v-if="items">
    <v-toolbar flat>
      <v-app-bar-nav-icon @click="showDrawer()"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $t('dashboard') }}</v-toolbar-title>
    </v-toolbar>

    <DashboardMenu
      :project-id="projectId"
      :project-type="projectType"
      :can-update-project="can(USER_PERMISSIONS.updateProject)"
    />

    <v-data-table
      :headers="headers"
      :items="items"
      class="mt-4 CenterToScreen"
      :footer-props="{ itemsPerPageOptions: [20] }"
      style="max-width: calc(var(--breakpoint-lg) - var(--nav-drawer-width)); margin: auto;"
    >
      <template v-slot:item.created="{ item }">
        {{ item.created | formatDate }}
      </template>
      <template v-slot:item.description="{ item }">
        {{ formatDescription(item.description) }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import ItemListPageBase from '@/components/ItemListPageBase';
import DashboardMenu from '@/components/DashboardMenu.vue';

export default {
  components: { DashboardMenu },

  mixins: [ItemListPageBase],

  methods: {
    formatDescription(description) {
      if (!description) return description;

      const task = description.match(/^Task ID (\d+) \((.*)\) (?:finished with status )?([A-Z_]+)$/);
      if (task) {
        const status = {
          WAITING: 'status_waiting',
          STARTING: 'status_starting',
          RUNNING: 'status_running',
          SUCCESS: 'status_success',
          ERROR: 'status_failed',
          STOPPING: 'status_stopping',
          STOPPED: 'status_stopped',
          CONFIRMED: 'status_confirmed',
          WAITING_CONFIRMATION: 'status_waiting_confirmation',
          REJECTED: 'status_rejected',
        }[task[3]];
        if (status) {
          return this.$t('activityTaskStatus', {
            id: task[1], name: task[2], status: this.$t(status),
          });
        }
      }

      if (description === 'Project created') return this.$t('activityProjectCreated');

      const specificEvents = [
        [/^Secret storage with ID (\d+) has been updated$/, 'activityStorageUpdated'],
        [/^Secret storage (.+) has been created$/, 'activityStorageCreated'],
        [/^Secret storage with ID (\d+) has been synced$/, 'activityStorageSynced'],
        [/^Template ID (\d+) description updated$/, 'activityTemplateDescriptionUpdated'],
        [/^Environment (.+) secrets synced$/, 'activityEnvironmentSecretsSynced'],
        [/^User ID (\d+) added to team$/, 'activityUserAdded'],
        [/^User ID (\d+) removed from team$/, 'activityUserRemoved'],
        [/^Changed role for User ID (\d+)$/, 'activityUserRoleChanged'],
      ];
      const specific = specificEvents
        .map(([pattern, key]) => ({ match: description.match(pattern), key }))
        .find(({ match }) => match);
      if (specific) return this.$t(specific.key, { value: specific.match[1] });

      const resource = description.match(/^(Template ID|Environment|Inventory|Repository|Schedule ID|Access Key|View) (.+) (created|updated|deleted)$/);
      if (resource) {
        const resourceKey = {
          'Template ID': 'template',
          Environment: 'environment',
          Inventory: 'inventory',
          Repository: 'repository2',
          'Schedule ID': 'schedule',
          'Access Key': 'accessKey',
          View: 'view',
        }[resource[1]];
        const actionKey = {
          created: 'activityCreated',
          updated: 'activityUpdated',
          deleted: 'activityDeleted',
        }[resource[3]];
        if (resourceKey && actionKey) {
          return this.$t('activityResourceAction', {
            resource: this.$t(resourceKey), name: resource[2], action: this.$t(actionKey),
          });
        }
      }

      return description;
    },

    getHeaders() {
      return [
        {
          text: this.$i18n.t('time'),
          value: 'created',
          sortable: false,
          width: '20%',
        },
        {
          text: this.$i18n.t('user'),
          value: 'username',
          sortable: false,
          width: '10%',
        },
        {
          text: this.$i18n.t('description'),
          value: 'description',
          sortable: false,
          width: '70%',
        },
      ];
    },

    getItemsUrl() {
      return `/api/project/${this.projectId}/events/last`;
    },
  },
};
</script>
