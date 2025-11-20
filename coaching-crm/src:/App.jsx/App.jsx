import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Search, Bell, User, Mail, X, TrendingUp, Users, Clock, Home, Trash2 } from 'lucide-react';

const STAGES = ['Lead', 'Qualified', 'Discovery Scheduled', 'Discovery Complete', 'Contract Sent', 'Active Client', 'Completed'];

const INITIAL_CLIENTS = [
  { id: 1, name: 'Angie Boudreau', email: 'angie@example.com', phone: '', stage: 'Active Client', discoveryDate: '2025-10-10', contractSignedDate: '2025-10-31', firstSessionDate: '2025-10-31', finalSessionDate: '', notes: '', tasks: { leadGen: true, sendFreeOffer: true, qualified: 'Yes', discoveryInvite: true, discoveryScheduled: true, discoveryIntakeSent: true, discoveryIntakeCompleted: true, discoveryDone: true, contractSent: true, contractSigned: true, invoiceSent: true, invoicePaid: true, engagementIntakeSent: true, engagementIntakeCompleted: true, eliEmailSentDate: '2025-11-04', eliCompleted: true, firstSessionScheduled: true, fourThingsEmailSent: false, testimonialCompleted: false, twoThingsEmailSent: false }},
  { id: 2, name: 'Liz McCann', email: 'liz@example.com', phone: '', stage: 'Active Client', discoveryDate: '2025-06-25', contractSignedDate: '2025-10-16', firstSessionDate: '2025-10-27', finalSessionDate: '', notes: '', tasks: { leadGen: true, sendFreeOffer: true, qualified: 'Yes', discoveryInvite: true, discoveryScheduled: true, discoveryIntakeSent: true, discoveryIntakeCompleted: true, discoveryDone: true, contractSent: true, contractSigned: true, invoiceSent: true, invoicePaid: true, engagementIntakeSent: true, engagementIntakeCompleted: true, eliEmailSentDate: '2025-11-04', eliCompleted: true, firstSessionScheduled: true, fourThingsEmailSent: false, testimonialCompleted: false, twoThingsEmailSent: false }},
  { id: 3, name: 'Sam Porter', email: 'sam@example.com', phone: '', stage: 'Active Client', discoveryDate: '2025-10-23', contractSignedDate: '2025-10-27', firstSessionDate: '2025-11-04', finalSessionDate: '', notes: 'Also sent presentations from LHH prior to the first session', tasks: { leadGen: true, sendFreeOffer: true, qualified: 'Yes', discoveryInvite: true, discoveryScheduled: true, discoveryIntakeSent: true, discoveryIntakeCompleted: true, discoveryDone: true, contractSent: true, contractSigned: true, invoiceSent: true, invoicePaid: true, engagementIntakeSent: true, engagementIntakeCompleted: true, eliEmailSentDate: '2025-11-04', eliCompleted: true, firstSessionScheduled: true, fourThingsEmailSent: false, testimonialCompleted: false, twoThingsEmailSent: false }},
  { id: 4, name: 'Gwyn Herrity', email: 'gwyn@example.com', phone: '', stage: 'Completed', discoveryDate: '2025-04-25', contractSignedDate: '2025-04-25', firstSessionDate: '2025-05-02', finalSessionDate: '2025-11-07', notes: 'Dates are not correct. Just for spreadsheet purposes', tasks: { leadGen: true, sendFreeOffer: true, qualified: 'Yes', discoveryInvite: true, discoveryScheduled: true, discoveryIntakeSent: true, discoveryIntakeCompleted: true, discoveryDone: true, contractSent: true, contractSigned: true, invoiceSent: true, invoicePaid: true, engagementIntakeSent: true, engagementIntakeCompleted: true, eliEmailSentDate: '2025-11-14', eliCompleted: true, firstSessionScheduled: true, fourThingsEmailSent: true, testimonialCompleted: false, twoThingsEmailSent: false }},
  { id: 5, name: 'Sohil Parekh', email: 'sohil@example.com', phone: '', stage: 'Completed', discoveryDate: '2025-06-12', contractSignedDate: '2025-06-13', firstSessionDate: '2025-06-13', finalSessionDate: '2025-09-12', notes: 'Dates are not correct. Just for spreadsheet purposes', tasks: { leadGen: true, sendFreeOffer: true, qualified: 'Yes', discoveryInvite: true, discoveryScheduled: true, discoveryIntakeSent: true, discoveryIntakeCompleted: true, discoveryDone: true, contractSent: true, contractSigned: true, invoiceSent: true, invoicePaid: true, engagementIntakeSent: true, engagementIntakeCompleted: true, eliEmailSentDate: '2025-11-14', eliCompleted: true, firstSessionScheduled: true, fourThingsEmailSent: true, testimonialCompleted: false, twoThingsEmailSent: false }}
];

export default function CoachingCRM() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [showReminders, setShowReminders] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get('crm-clients');
        if (result && result.value) {
          let loadedClients = JSON.parse(result.value);
          if (loadedClients.length < 5) {
            loadedClients = INITIAL_CLIENTS;
          }
          loadedClients = loadedClients.map(client => {
            if (client.stage === 'Active Client') {
              return { ...client, finalSessionDate: '' };
            }
            return client;
          });
          setClients(loadedClients);
        } else {
          setClients(INITIAL_CLIENTS);
        }
      } catch (error) {
        setClients(INITIAL_CLIENTS);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      window.storage.set('crm-clients', JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = () => {
    if (!newClientName.trim()) return;
    const newClient = {
      id: Date.now(), name: newClientName.trim(), email: newClientEmail.trim(), phone: '', stage: 'Lead', leadGenDate: new Date().toISOString().split('T')[0], notes: '',
      tasks: { leadGen: true, sendFreeOffer: false, qualified: '', discoveryInvite: false, discoveryScheduled: false, discoveryIntakeSent: false, discoveryIntakeCompleted: false, discoveryDone: false, contractSent: false, contractSigned: false, invoiceSent: false, invoicePaid: false, engagementIntakeSent: false, engagementIntakeCompleted: false, eliEmailSentDate: '', eliCompleted: false, firstSessionScheduled: false, fourThingsEmailSent: false, testimonialCompleted: false, twoThingsEmailSent: false }
    };
    setClients([...clients, newClient]);
    setNewClientName('');
    setNewClientEmail('');
    setShowAddClient(false);
    setSelectedClient(newClient);
    setCurrentView('clients');
  };

  const updateClient = (clientId, updates) => {
    setClients(clients.map(c => c.id === clientId ? { ...c, ...updates } : c));
    if (selectedClient?.id === clientId) {
      setSelectedClient({ ...selectedClient, ...updates });
    }
  };

  const toggleTask = (clientId, taskKey) => {
    const client = clients.find(c => c.id === clientId);
    const updatedTasks = { ...client.tasks, [taskKey]: !client.tasks[taskKey] };
    updateClient(clientId, { tasks: updatedTasks });
  };

  const deleteClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setClientToDelete(client);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setSelectedClient(null);
      setShowDeleteConfirm(false);
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'All' || client.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const getReminders = () => {
    const reminders = [];
    const today = new Date();
    clients.forEach(client => {
      if (client.tasks.discoveryScheduled && !client.tasks.discoveryIntakeSent) {
        reminders.push({ client: client.name, message: 'Send Discovery Intake form', urgent: true });
      }
      if (client.tasks.discoveryDone && !client.tasks.contractSent) {
        reminders.push({ client: client.name, message: 'Send contract', urgent: true });
      }
      if (client.tasks.contractSigned && !client.tasks.invoiceSent) {
        reminders.push({ client: client.name, message: 'Send invoice', urgent: true });
      }
      if (client.finalSessionDate && client.finalSessionDate !== '' && !client.tasks.fourThingsEmailSent) {
        const daysSince = Math.floor((today - new Date(client.finalSessionDate)) / (1000 * 60 * 60 * 24));
        if (daysSince >= 7) {
          reminders.push({ client: client.name, message: 'Send Four Things email', urgent: daysSince >= 10 });
        }
      }
      if (client.finalSessionDate && client.finalSessionDate !== '' && !client.tasks.twoThingsEmailSent) {
        const daysSince = Math.floor((today - new Date(client.finalSessionDate)) / (1000 * 60 * 60 * 24));
        if (daysSince >= 56) {
          reminders.push({ client: client.name, message: 'Send Two Things email', urgent: true });
        }
      }
    });
    return reminders;
  };

  const reminders = getReminders();

  const getStats = () => {
    const stats = { total: clients.length, byStage: {}, active: clients.filter(c => c.stage === 'Active Client').length, completed: clients.filter(c => c.stage === 'Completed').length, pendingTasks: reminders.length };
    STAGES.forEach(stage => { stats.byStage[stage] = clients.filter(c => c.stage === stage).length; });
    return stats;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">Coaching CRM</h1>
              <nav className="flex gap-2">
                <button onClick={() => setCurrentView('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><Home size={18} />Dashboard</button>
                <button onClick={() => setCurrentView('clients')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentView === 'clients' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><Users size={18} />Clients</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowReminders(!showReminders)} className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
                {reminders.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{reminders.length}</span>}
              </button>
              <button onClick={() => setShowAddClient(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} />Add Client</button>
            </div>
          </div>
        </div>
      </div>

      {showReminders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
          <div className="bg-white rounded-lg shadow-xl w-96">
            <div className="p-4 border-b flex items-center justify-between"><h2 className="font-semibold">Reminders</h2><button onClick={() => setShowReminders(false)}><X size={20} /></button></div>
            <div className="p-4">{reminders.length === 0 ? <p className="text-center py-8 text-gray-500">No reminders! 🎉</p> : <div className="space-y-3">{reminders.map((r, i) => <div key={i} className={`p-3 rounded-lg ${r.urgent ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}><div className="font-medium">{r.client}</div><div className="text-sm">{r.message}</div></div>)}</div>}</div>
          </div>
        </div>
      )}

      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
              <div className="space-y-4">
                <input type="text" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Client name" />
                <input type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Email" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddClient(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={addClient} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Delete Client</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to delete <strong>{clientToDelete.name}</strong>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setClientToDelete(null); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Total Clients</p><p className="text-3xl font-bold mt-1">{stats.total}</p></div><Users className="text-blue-600" size={32} /></div></div>
              <div className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Active</p><p className="text-3xl font-bold mt-1">{stats.active}</p></div><TrendingUp className="text-green-600" size={32} /></div></div>
              <div className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Completed</p><p className="text-3xl font-bold mt-1">{stats.completed}</p></div><CheckSquare className="text-purple-600" size={32} /></div></div>
              <div className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Action Items</p><p className="text-3xl font-bold mt-1">{stats.pendingTasks}</p></div><Clock className="text-orange-600" size={32} /></div></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Pipeline Overview</h2>
              <div className="space-y-3">
                {STAGES.map(stage => {
                  const count = stats.byStage[stage] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return <div key={stage}><div className="flex justify-between mb-1"><span className="text-sm font-medium">{stage}</span><span className="text-sm text-gray-600">{count}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} /></div></div>;
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Action Items</h2>
              {reminders.length === 0 ? <p className="text-center py-8 text-gray-500">All caught up! 🎉</p> : <div className="space-y-2">{reminders.map((r, i) => <div key={i} className="flex justify-between p-3 hover:bg-gray-50 rounded-lg"><div><div className="font-medium">{r.client}</div><div className="text-sm text-gray-600">{r.message}</div></div>{r.urgent && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full h-fit">Urgent</span>}</div>)}</div>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3"><Search size={18} className="text-gray-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="flex-1 outline-none text-sm" /></div>
                <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="All">All Stages</option>{STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select>
              </div>
              <div className="space-y-2">{filteredClients.map(client => <div key={client.id} onClick={() => setSelectedClient(client)} className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer ${selectedClient?.id === client.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}><h3 className="font-semibold">{client.name}</h3><p className="text-sm text-gray-600">{client.email}</p><span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{client.stage}</span></div>)}</div>
            </div>

            <div className="col-span-8">
              {selectedClient ? (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><User size={32} className="text-blue-600" /></div>
                        <div>
                          <input type="text" value={selectedClient.name} onChange={(e) => updateClient(selectedClient.id, { name: e.target.value })} className="text-2xl font-bold border-b border-transparent hover:border-gray-300 outline-none" />
                          <div className="flex gap-4 mt-2 text-sm text-gray-600"><div className="flex items-center gap-1"><Mail size={14} /><input type="email" value={selectedClient.email} onChange={(e) => updateClient(selectedClient.id, { email: e.target.value })} className="outline-none border-b border-transparent hover:border-gray-300" /></div></div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <select value={selectedClient.stage} onChange={(e) => updateClient(selectedClient.id, { stage: e.target.value })} className="px-3 py-2 border rounded-lg text-sm h-fit">{STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select>
                        <button onClick={() => deleteClient(selectedClient.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete client"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Key Dates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-gray-600 mb-1">Discovery</label><input type="date" value={selectedClient.discoveryDate || ''} onChange={(e) => updateClient(selectedClient.id, { discoveryDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="block text-sm text-gray-600 mb-1">Contract Signed</label><input type="date" value={selectedClient.contractSignedDate || ''} onChange={(e) => updateClient(selectedClient.id, { contractSignedDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="block text-sm text-gray-600 mb-1">First Session</label><input type="date" value={selectedClient.firstSessionDate || ''} onChange={(e) => updateClient(selectedClient.id, { firstSessionDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="block text-sm text-gray-600 mb-1">Final Session</label><input type="date" value={selectedClient.finalSessionDate || ''} onChange={(e) => updateClient(selectedClient.id, { finalSessionDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Workflow Tasks</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'sendFreeOffer', label: 'Send Free Offer' }, { key: 'discoveryInvite', label: 'Send Discovery Invite' }, { key: 'discoveryIntakeSent', label: 'Discovery Intake Sent' }, { key: 'discoveryDone', label: 'Discovery Call Complete' }, { key: 'contractSent', label: 'Contract Sent' }, { key: 'contractSigned', label: 'Contract Signed' }, { key: 'invoiceSent', label: 'Invoice Sent' }, { key: 'invoicePaid', label: 'Invoice Paid' }, { key: 'engagementIntakeSent', label: 'Engagement Intake Sent' }, { key: 'eliCompleted', label: 'ELI Completed' }, { key: 'firstSessionScheduled', label: 'First Session Scheduled' }, { key: 'fourThingsEmailSent', label: 'Four Things Email Sent' }, { key: 'testimonialCompleted', label: 'Testimonial Completed' }, { key: 'twoThingsEmailSent', label: 'Two Things Email Sent' }
                        ].map(task => <div key={task.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"><button onClick={() => toggleTask(selectedClient.id, task.key)}>{selectedClient.tasks[task.key] ? <CheckSquare className="text-green-600" size={20} /> : <Square className="text-gray-400" size={20} />}</button><span className={`text-sm ${selectedClient.tasks[task.key] ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{task.label}</span></div>)}
                      </div>
                    </div>

                    <div><h3 className="font-semibold mb-3">Notes</h3><textarea value={selectedClient.notes} onChange={(e) => updateClient(selectedClient.id, { notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows="4" placeholder="Add notes..." /></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center"><User size={48} className="mx-auto text-gray-400 mb-4" /><p className="text-gray-500">Select a client to view details</p></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}