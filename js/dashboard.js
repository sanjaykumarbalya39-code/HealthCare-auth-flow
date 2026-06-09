(function () {
  'use strict';

  var ROLE_KEY = 'stackly_role';

  var researcherData = {
    user: { name: 'Dr. Sarah Chen', initials: 'SC', role: 'Principal Investigator' },
    stats: [
      { label: 'Active Studies', value: '12', change: '+2 this month', trend: 'up', icon: 'studies' },
      { label: 'Samples Processed', value: '3,847', change: '+18% vs last quarter', trend: 'up', icon: 'samples' },
      { label: 'Pending Reviews', value: '7', change: '3 due this week', trend: 'down', icon: 'reviews' },
      { label: 'Citations', value: '156', change: '+12 in 2026', trend: 'up', icon: 'citations' }
    ],
    chart: [
      { label: 'Jan', value: 62 },
      { label: 'Feb', value: 78 },
      { label: 'Mar', value: 55 },
      { label: 'Apr', value: 88 },
      { label: 'May', value: 72 },
      { label: 'Jun', value: 95 }
    ],
    studies: [
      { id: 'STK-2026-041', title: 'CRISPR Knockout — BRCA1 Pathway', lead: 'Dr. Sarah Chen', status: 'active', samples: 284 },
      { id: 'STK-2026-038', title: 'Single-Cell RNA — Tumor Microenvironment', lead: 'Dr. James Okonkwo', status: 'review', samples: 512 },
      { id: 'STK-2026-035', title: 'mRNA Vaccine Stability — Phase II', lead: 'Dr. Elena Vasquez', status: 'active', samples: 156 },
      { id: 'STK-2026-029', title: 'Pharmacohealth diagnostics — CYP2D6 Variants', lead: 'Dr. Sarah Chen', status: 'pending', samples: 89 },
      { id: 'STK-2026-022', title: 'Alzheimer Biomarker Panel Validation', lead: 'Dr. Michael Torres', status: 'complete', samples: 420 }
    ],
    notifications: [
      { title: 'Peer review submitted', text: 'STK-2026-038 ready for committee review', time: '12m ago' },
      { title: 'Sequencing complete', text: 'NovaSeq run NS-8847 finished processing', time: '1h ago' },
      { title: 'Collaborator invite', text: 'Dr. Okonkwo joined your research group', time: '3h ago' },
      { title: 'Sample alert', text: 'Cold storage unit B-12 temperature normalized', time: '5h ago' }
    ],
    sampleStats: [
      { label: 'In Processing', value: '142', change: 'NovaSeq queue active', trend: 'up', icon: 'samples' },
      { label: 'Stored', value: '2,891', change: '98% capacity', trend: 'up', icon: 'studies' },
      { label: 'Awaiting QC', value: '38', change: '12 flagged today', trend: 'down', icon: 'reviews' },
      { label: 'Sequenced', value: '814', change: '+64 this week', trend: 'up', icon: 'citations' }
    ],
    samples: [
      { id: 'SMP-88471', type: 'Blood — EDTA', study: 'STK-2026-041', status: 'diagnostics', storage: 'LN2 Tank A-04' },
      { id: 'SMP-88452', type: 'Tissue — FFPE', study: 'STK-2026-038', status: 'review', storage: 'Ambient Rack B-12' },
      { id: 'SMP-88390', type: 'Saliva', study: 'STK-2026-035', status: 'stored', storage: '4°C Unit C-02' },
      { id: 'SMP-88341', type: 'Plasma', study: 'STK-2026-029', status: 'processing', storage: '−80°C Freezer D-07' },
      { id: 'SMP-88298', type: 'PBMC', study: 'STK-2026-022', status: 'complete', storage: 'LN2 Tank A-11' }
    ],
    reports: [
      { name: 'Q2 Sequencing Throughput Summary', date: 'Jun 1, 2026', format: 'PDF', size: '2.4 MB' },
      { name: 'STK-2026-038 — scRNA Analysis Export', date: 'May 28, 2026', format: 'CSV', size: '18.7 MB' },
      { name: 'Cold Storage Compliance Audit', date: 'May 20, 2026', format: 'PDF', size: '1.1 MB' },
      { name: 'Collaborator Activity — May 2026', date: 'May 15, 2026', format: 'XLSX', size: '640 KB' }
    ]
  };

  var userData = {
    user: { name: 'Alexandra Mitchell', initials: 'AM', role: 'Patient Portal' },
    stats: [
      { label: 'Upcoming Appointments', value: '2', change: 'Next: Jun 12', trend: 'up', icon: 'calendar' },
      { label: 'Reports Ready', value: '3', change: 'Download available', trend: 'up', icon: 'reports' },
      { label: 'Messages', value: '4', change: '1 unread', trend: 'up', icon: 'messages' },
      { label: 'Health Score', value: '87', change: '+3 from last visit', trend: 'up', icon: 'health' }
    ],
    appointments: [
      { day: '12', month: 'Jun', title: 'Genomic Counseling Session', meta: 'Dr. Elena Vasquez · Virtual · 10:00 AM' },
      { day: '28', month: 'Jun', title: 'Follow-Up Blood Panel Review', meta: 'MedCare Diagnostics Lab · 2:30 PM' }
    ],
    results: [
      { name: 'Full Health Report', date: 'May 28, 2026', status: 'Ready' },
      { name: 'Pharmacohealth diagnostics Panel', date: 'May 15, 2026', status: 'Ready' },
      { name: 'Vitamin D & Metabolic Panel', date: 'Apr 22, 2026', status: 'Reviewed' }
    ],
    messages: [
      { from: 'Care Team', initials: 'CT', snippet: 'Your diagnostics report is now available…' },
      { from: 'Dr. Vasquez', initials: 'EV', snippet: 'Please review pre-appointment instructions…' },
      { from: 'Billing Support', initials: 'BS', snippet: 'Insurance pre-authorization confirmed…' }
    ],
    notifications: [
      { title: 'Report available', text: 'Your Full Health Report results are ready', time: '2h ago' },
      { title: 'Appointment reminder', text: 'Genomic counseling on June 12 at 10:00 AM', time: '1d ago' },
      { title: 'Message received', text: 'Dr. Vasquez sent you pre-visit instructions', time: '2d ago' }
    ],
    healthScore: 87
  };

  function protectRoute(expectedRole) {
    var role = sessionStorage.getItem(ROLE_KEY);
    if (!role) {
      window.location.replace('login.html');
      return false;
    }
    if (expectedRole && role !== expectedRole) {
      window.location.replace(role === 'researcher' ? 'dashboard-researcher.html' : 'dashboard-user.html');
      return false;
    }
    return true;
  }

  function iconSvg(type) {
    var icons = {
      studies: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
      samples: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
      reviews: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      citations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
      messages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
      health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    };
    return icons[type] || icons.studies;
  }

  function iconColorClass(index) {
    var classes = ['stat-card__icon--blue', 'stat-card__icon--teal', 'stat-card__icon--cyan', 'stat-card__icon--purple'];
    return classes[index % classes.length];
  }

  function statusClass(status) {
    var map = {
      active: 'status-pill--active',
      pending: 'status-pill--pending',
      review: 'status-pill--review',
      complete: 'status-pill--complete'
    };
    return map[status] || 'status-pill--pending';
  }

  function renderStats(container, stats) {
    if (!container) return;
    container.innerHTML = stats.map(function (stat, i) {
      return (
        '<article class="stat-card">' +
          '<div class="stat-card__icon ' + iconColorClass(i) + '">' + iconSvg(stat.icon) + '</div>' +
          '<div class="stat-card__value">' + stat.value + '</div>' +
          '<div class="stat-card__label">' + stat.label + '</div>' +
          '<div class="stat-card__change stat-card__change--' + stat.trend + '">' + stat.change + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderChart(container, chartData) {
    if (!container) return;
    var max = Math.max.apply(null, chartData.map(function (d) { return d.value; }));
    container.innerHTML = chartData.map(function (item) {
      var height = Math.round((item.value / max) * 100);
      return (
        '<div class="chart-bar">' +
          '<div class="chart-bar__fill" style="height:' + height + '%" role="presentation"></div>' +
          '<span class="chart-bar__label">' + item.label + '</span>' +
        '</div>'
      );
    }).join('');
  }

  function renderStudiesTable(tbody, studies) {
    if (!tbody) return;
    tbody.innerHTML = studies.map(function (study) {
      return (
        '<tr>' +
          '<td><strong>' + study.id + '</strong></td>' +
          '<td>' + study.title + '</td>' +
          '<td>' + study.lead + '</td>' +
          '<td><span class="status-pill ' + statusClass(study.status) + '">' + study.status + '</span></td>' +
          '<td>' + study.samples + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  function renderNotifications(list, items) {
    if (!list) return;
    list.innerHTML = items.map(function (n) {
      return (
        '<li class="dropdown__item">' +
          '<div class="dropdown__item-icon">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>' +
          '</div>' +
          '<div>' +
            '<div class="dropdown__item-title">' + n.title + '</div>' +
            '<div class="dropdown__item-text">' + n.text + '</div>' +
          '</div>' +
          '<span class="dropdown__item-time">' + n.time + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderAppointments(container, items) {
    if (!container) return;
    container.innerHTML = items.map(function (a) {
      return (
        '<div class="appointment-card">' +
          '<div class="appointment-card__date">' +
            '<span class="appointment-card__day">' + a.day + '</span>' +
            '<span class="appointment-card__month">' + a.month + '</span>' +
          '</div>' +
          '<div>' +
            '<div class="appointment-card__title">' + a.title + '</div>' +
            '<div class="appointment-card__meta">' + a.meta + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderResults(container, items) {
    if (!container) return;
    var isFullList = container.id === 'resultsListFull';
    container.innerHTML = items.map(function (r) {
      var action = isFullList && r.status === 'Ready'
        ? '<button type="button" class="btn btn--outline btn--sm" data-download-item="' + r.name + '">Download</button>'
        : '<span class="result-row__status">' + r.status + '</span>';
      return (
        '<div class="result-row">' +
          '<div>' +
            '<div class="result-row__name">' + r.name + '</div>' +
            '<div class="result-row__date">' + r.date + '</div>' +
          '</div>' +
          action +
        '</div>'
      );
    }).join('');
  }

  function renderMessages(container, items) {
    if (!container) return;
    container.innerHTML = items.map(function (m) {
      return (
        '<div class="message-preview">' +
          '<div class="message-preview__avatar">' + m.initials + '</div>' +
          '<div>' +
            '<div class="message-preview__from">' + m.from + '</div>' +
            '<div class="message-preview__snippet">' + m.snippet + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderSamplesTable(tbody, samples) {
    if (!tbody) return;
    tbody.innerHTML = samples.map(function (sample) {
      return (
        '<tr>' +
          '<td><strong>' + sample.id + '</strong></td>' +
          '<td>' + sample.type + '</td>' +
          '<td>' + sample.study + '</td>' +
          '<td><span class="status-pill ' + statusClass(sample.status === 'complete' ? 'complete' : sample.status === 'review' ? 'review' : sample.status === 'stored' ? 'pending' : 'active') + '">' + sample.status + '</span></td>' +
          '<td>' + sample.storage + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  function renderReportsList(container, reports) {
    if (!container) return;
    container.innerHTML = reports.map(function (report) {
      return (
        '<div class="result-row">' +
          '<div>' +
            '<div class="result-row__name">' + report.name + '</div>' +
            '<div class="result-row__date">' + report.date + ' · ' + report.format + ' · ' + report.size + '</div>' +
          '</div>' +
          '<button type="button" class="btn btn--outline btn--sm" data-download-item="' + report.name + '">Download</button>' +
        '</div>'
      );
    }).join('');
  }

  function switchSection(sectionId) {
    if (!sectionId) return;
    document.querySelectorAll('.dashboard-section').forEach(function (section) {
      var isActive = section.getAttribute('data-section') === sectionId;
      section.classList.toggle('is-active', isActive);
      section.hidden = !isActive;
    });
  }

  function setActiveSidebarLink(sectionId) {
    document.querySelectorAll('.sidebar__link[data-section]').forEach(function (link) {
      var isActive = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function activateSection(sectionId) {
    if (!sectionId) return;
    if (window.MedCareDashboard && typeof window.MedCareDashboard.switchSection === 'function') {
      window.MedCareDashboard.switchSection(sectionId);
      return;
    }
    switchSection(sectionId);
    setActiveSidebarLink(sectionId);
    var main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var toggle = document.getElementById('sidebarToggle');

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('sidebar-open');
    }

    function openSidebar() {
      if (sidebar) sidebar.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('sidebar-open');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (sidebar && sidebar.classList.contains('is-open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (overlay) overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.sidebar__link[data-section]').forEach(function (link) {
      link.addEventListener('click', function () {
        activateSection(link.getAttribute('data-section'));
        if (window.innerWidth <= 1024) closeSidebar();
      });
    });

    var logoLink = document.querySelector('.sidebar__logo');
    if (logoLink) {
      logoLink.addEventListener('click', function (e) {
        e.preventDefault();
        activateSection('dashboard');
        if (window.innerWidth <= 1024) closeSidebar();
      });
    }
  }

  var toastTimer = null;

  function showToast(message) {
    if (window.MedCareDashboard && typeof window.MedCareDashboard.showToast === 'function') {
      window.MedCareDashboard.showToast(message);
      return;
    }
    var toast = document.getElementById('dashboardToast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        toast.hidden = true;
      }, 300);
    }, 3200);
  }

  function initSectionJumps() {
    document.querySelectorAll('[data-section-jump]').forEach(function (trigger) {
      if (trigger.id === 'bookConsultationBtn') return;
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        activateSection(trigger.getAttribute('data-section-jump'));
      });
    });

    document.querySelectorAll('[data-download-report]').forEach(function (trigger) {
      if (trigger.id === 'downloadReportBtn') return;
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        activateSection('results');
        showToast('Your latest medical report is ready to download.');
      });
    });

    document.addEventListener('click', function (e) {
      var downloadBtn = e.target.closest('[data-download-item]');
      if (!downloadBtn) return;
      e.preventDefault();
      showToast('Downloading ' + (downloadBtn.getAttribute('data-download-item') || 'report') + '…');
    });

    document.querySelectorAll('a[href="#"]').forEach(function (link) {
      if (link.classList.contains('sidebar__logo')) return;
      link.addEventListener('click', function (e) {
        e.preventDefault();
      });
    });
  }

  function isMobileDropdown() {
    return window.innerWidth <= 1024;
  }

  function initDropdowns() {
    var notifBtn = document.getElementById('notifBtn');
    var notifDropdown = document.getElementById('notifDropdown');
    var profileBtn = document.getElementById('profileBtn');
    var profileDropdown = document.getElementById('profileDropdown');
    var profileBackdrop = document.getElementById('profileBackdrop');
    var profileWrap = profileBtn ? profileBtn.closest('.dropdown-wrap') : null;

    function setProfileBackdrop() {
      if (profileBackdrop) {
        profileBackdrop.classList.remove('is-visible');
        profileBackdrop.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('profile-dropdown-open');
    }

    function closeAll() {
      if (notifDropdown) notifDropdown.classList.remove('is-open');
      if (profileDropdown) profileDropdown.classList.remove('is-open');
      if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
      if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
      setProfileBackdrop(false);
      if (profileDropdown && profileWrap && profileDropdown.parentNode === document.body) {
        profileWrap.appendChild(profileDropdown);
      }
    }

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = notifDropdown.classList.toggle('is-open');
        notifBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (profileDropdown) profileDropdown.classList.remove('is-open');
        setProfileBackdrop(false);
      });
    }

    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = profileDropdown.classList.toggle('is-open');
        profileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (notifDropdown) notifDropdown.classList.remove('is-open');

        if (open && isMobileDropdown()) {
          document.body.appendChild(profileDropdown);
        } else if (!open && profileWrap && profileDropdown.parentNode === document.body) {
          profileWrap.appendChild(profileDropdown);
        }

        setProfileBackdrop();
      });
    }

    if (profileDropdown) {
      profileDropdown.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    if (notifDropdown) {
      notifDropdown.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    document.addEventListener('click', closeAll);

    window.addEventListener('resize', function () {
      if (!profileDropdown || !profileDropdown.classList.contains('is-open')) return;
      if (!isMobileDropdown() && profileWrap && profileDropdown.parentNode === document.body) {
        profileWrap.appendChild(profileDropdown);
        setProfileBackdrop(false);
      }
    });

    document.querySelectorAll('[data-logout]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'login.html';
      });
    });

    document.querySelectorAll('[data-profile-action]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeAll();
        var action = btn.getAttribute('data-profile-action');
        if (action === 'profile') {
          showToast('Profile settings are coming soon.');
        } else if (action === 'settings') {
          showToast('Account settings are coming soon.');
        }
      });
    });
  }

  function deriveNameFromEmail(email) {
    var local = String(email).split('@')[0] || '';
    var parts = local.replace(/[._+-]/g, ' ').split(/\s+/).filter(Boolean);
    if (!parts.length) return 'MedCare User';
    return parts.map(function (p) {
      return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    }).join(' ');
  }

  function getInitials(name, email) {
    if (name && name.trim()) {
      return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
    }
    if (email) return email.charAt(0).toUpperCase();
    return 'SU';
  }

  function setProfile(data) {
    var storedEmail = sessionStorage.getItem('stackly_user_email') || '';
    var storedName = sessionStorage.getItem('stackly_user_name');
    var storedOrg = sessionStorage.getItem('stackly_user_org') || '';
    var role = sessionStorage.getItem(ROLE_KEY);
    var name = storedName || (storedEmail ? deriveNameFromEmail(storedEmail) : data.user.name);
    var displayRole = data.user.role;

    if (role === 'researcher' && storedOrg) {
      displayRole = storedOrg;
    }

    var initials = getInitials(name, storedEmail);
    var firstName = name.split(' ')[0];

    var ids = [
      'welcomeName', 'profileName', 'profileRole', 'profileEmail',
      'profileAvatar', 'sidebarProfileName', 'sidebarProfileEmail',
      'sidebarProfileAvatar', 'dropdownProfileName', 'dropdownProfileEmail',
      'dropdownProfileAvatar', 'welcomeEmail'
    ];

    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;

      if (id === 'welcomeName') el.textContent = firstName;
      else if (id === 'profileName' || id === 'sidebarProfileName' || id === 'dropdownProfileName') el.textContent = name;
      else if (id === 'profileRole') el.textContent = role === 'researcher' ? 'Researcher' : 'Patient';
      else if (id.indexOf('Email') !== -1) el.textContent = storedEmail || '—';
      else if (id.indexOf('Avatar') !== -1) el.textContent = initials;
    });

    document.querySelectorAll('[data-profile-email]').forEach(function (el) {
      el.textContent = storedEmail;
    });
    document.querySelectorAll('[data-profile-name]').forEach(function (el) {
      el.textContent = name;
    });
  }

  function initResearcher() {
    if (!protectRoute('researcher')) return;

    setProfile(researcherData);
    renderStats(document.getElementById('statsGrid'), researcherData.stats);
    renderChart(document.getElementById('activityChart'), researcherData.chart);
    renderStudiesTable(document.getElementById('studiesTableBody'), researcherData.studies);
    renderStudiesTable(document.getElementById('studiesTableBodyFull'), researcherData.studies);
    renderStats(document.getElementById('samplesStatsGrid'), researcherData.sampleStats);
    renderSamplesTable(document.getElementById('samplesTableBody'), researcherData.samples);
    renderReportsList(document.getElementById('reportsList'), researcherData.reports);
    renderNotifications(document.getElementById('notifList'), researcherData.notifications);
  }

  function initUser() {
    if (!protectRoute('user')) return;

    setProfile(userData);
    renderStats(document.getElementById('statsGrid'), userData.stats);
    renderAppointments(document.getElementById('appointmentsList'), userData.appointments);
    renderAppointments(document.getElementById('appointmentsListFull'), userData.appointments);
    renderResults(document.getElementById('resultsList'), userData.results);
    renderResults(document.getElementById('resultsListFull'), userData.results);
    renderMessages(document.getElementById('messagesList'), userData.messages);
    renderMessages(document.getElementById('messagesListFull'), userData.messages);
    renderNotifications(document.getElementById('notifList'), userData.notifications);

    var scoreEl = document.getElementById('healthScoreValue');
    var ringProgress = document.getElementById('healthScoreRing');
    if (scoreEl) scoreEl.textContent = userData.healthScore;
    if (ringProgress) {
      var circumference = 2 * Math.PI * 54;
      var offset = circumference - (userData.healthScore / 100) * circumference;
      ringProgress.style.strokeDasharray = circumference;
      ringProgress.style.strokeDashoffset = offset;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-dashboard');
    initSidebar();
    initSectionJumps();
    initDropdowns();

    if (page === 'researcher') initResearcher();
    if (page === 'user') initUser();
  });
})();
