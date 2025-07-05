HAMDENI COMPUTER SCIENCE PLATFORM – DEPLOYMENT GUIDE
=====================================================

✅ This folder is optimized for deployment on Render using your custom domain: hamdeni-cs.tn

📁 Structure:
-------------
- /public/index.html         ← Your main site
- /public/404.html           ← Custom not-found page
- /public/*                  ← CSS, JS, images, etc.

📌 STEP 1 – Deploy to Render
-----------------------------
1. Go to https://dashboard.render.com
2. Create a new "Static Site"
3. Connect to GitHub OR upload this folder as ZIP manually
4. Set these values:
   - Build Command: (leave blank)
   - Publish Directory: public

📌 STEP 2 – Add Custom Domain (hamdeni-cs.tn)
---------------------------------------------
In Render:
- Go to your Static Site → Settings → Custom Domains
- Add: hamdeni-cs.tn
- Add: www.hamdeni-cs.tn

On Atlax.tn DNS panel:
- Add A record:
    Type: A
    Host: @
    Value: (Render will provide an IP, e.g. 216.24.57.1xx)

- Add CNAME:
    Type: CNAME
    Host: www
    Value: your-site-name.onrender.com

Then:
- Back in Render, enable SSL and "Force HTTPS"
- Wait for domain to propagate (15-60 minutes)

📌 STEP 3 – Redirect www to root (Optional)
-------------------------------------------
Render should handle this via redirect.
For client-side fallback, you can add JavaScript redirect if needed.

📌 STEP 4 – Enable auto-deploy (if using GitHub)
------------------------------------------------
- Go to Deploys tab
- Enable auto-deploy on push to main branch

📌 STEP 5 – Final Test
----------------------
- Open https://hamdeni-cs.tn from multiple devices
- Test SSL (https), loading speed, and page not found

Environment Variables
---------------------
Configuration values are injected into `frontend/config.js` using the build
script. Set these variables and run `npm run build` before starting the server
or uploading the static site:

```
SUPABASE_URL      your Supabase project URL
SUPABASE_KEY      your Supabase service key
TEACHER_PASSWORD  password required for the teacher dashboard
```

When hosting the `frontend` folder on a static service, run `npm run build`
locally so that `frontend/config.js` contains your credentials before
uploading the site.

These variables are **not** committed to the repository.
# Database Schema

Legend: PK=Primary Key, FK=Foreign Key, Nullable=YES if column allows NULL.

## Schema `auth`

### Table `audit_log_entries`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| instance_id | uuid | YES | null |  |  | null(null) |
| id | uuid | NO | null | PK |  | null(null) |
| payload | json | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| ip_address | character varying | NO | ''::character varying |  |  | null(null) |

### Table `flow_state`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| user_id | uuid | YES | null |  |  | null(null) |
| auth_code | text | NO | null |  |  | null(null) |
| code_challenge_method | USER-DEFINED | NO | null |  |  | null(null) |
| code_challenge | text | NO | null |  |  | null(null) |
| provider_type | text | NO | null |  |  | null(null) |
| provider_access_token | text | YES | null |  |  | null(null) |
| provider_refresh_token | text | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| authentication_method | text | NO | null |  |  | null(null) |
| auth_code_issued_at | timestamp with time zone | YES | null |  |  | null(null) |

### Table `identities`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| provider_id | text | NO | null |  | UQ | null(null) |
| user_id | uuid | NO | null |  |  | auth.users(id) |
| identity_data | jsonb | NO | null |  |  | null(null) |
| provider | text | NO | null |  | UQ | null(null) |
| last_sign_in_at | timestamp with time zone | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| email | text | YES | null |  |  | null(null) |
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |

### Table `instances`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| uuid | uuid | YES | null |  |  | null(null) |
| raw_base_config | text | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |

### Table `mfa_amr_claims`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| session_id | uuid | NO | null |  | UQ | auth.sessions(id) |
| created_at | timestamp with time zone | NO | null |  |  | null(null) |
| updated_at | timestamp with time zone | NO | null |  |  | null(null) |
| authentication_method | text | NO | null |  | UQ | null(null) |
| id | uuid | NO | null | PK |  | null(null) |

### Table `mfa_challenges`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| factor_id | uuid | NO | null |  |  | auth.mfa_factors(id) |
| created_at | timestamp with time zone | NO | null |  |  | null(null) |
| verified_at | timestamp with time zone | YES | null |  |  | null(null) |
| ip_address | inet | NO | null |  |  | null(null) |
| otp_code | text | YES | null |  |  | null(null) |
| web_authn_session_data | jsonb | YES | null |  |  | null(null) |

### Table `mfa_factors`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| user_id | uuid | NO | null |  |  | auth.users(id) |
| friendly_name | text | YES | null |  |  | null(null) |
| factor_type | USER-DEFINED | NO | null |  |  | null(null) |
| status | USER-DEFINED | NO | null |  |  | null(null) |
| created_at | timestamp with time zone | NO | null |  |  | null(null) |
| updated_at | timestamp with time zone | NO | null |  |  | null(null) |
| secret | text | YES | null |  |  | null(null) |
| phone | text | YES | null |  |  | null(null) |
| last_challenged_at | timestamp with time zone | YES | null |  | UQ | null(null) |
| web_authn_credential | jsonb | YES | null |  |  | null(null) |
| web_authn_aaguid | uuid | YES | null |  |  | null(null) |

### Table `one_time_tokens`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| user_id | uuid | NO | null |  |  | auth.users(id) |
| token_type | USER-DEFINED | NO | null |  |  | null(null) |
| token_hash | text | NO | null |  |  | null(null) |
| relates_to | text | NO | null |  |  | null(null) |
| created_at | timestamp without time zone | NO | now() |  |  | null(null) |
| updated_at | timestamp without time zone | NO | now() |  |  | null(null) |

### Table `refresh_tokens`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| instance_id | uuid | YES | null |  |  | null(null) |
| id | bigint | NO | nextval('auth.refresh_tokens_id_seq'::regclass) | PK |  | null(null) |
| token | character varying | YES | null |  | UQ | null(null) |
| user_id | character varying | YES | null |  |  | null(null) |
| revoked | boolean | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| parent | character varying | YES | null |  |  | null(null) |
| session_id | uuid | YES | null |  |  | auth.sessions(id) |

### Table `saml_providers`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| sso_provider_id | uuid | NO | null |  |  | auth.sso_providers(id) |
| entity_id | text | NO | null |  | UQ | null(null) |
| metadata_xml | text | NO | null |  |  | null(null) |
| metadata_url | text | YES | null |  |  | null(null) |
| attribute_mapping | jsonb | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| name_id_format | text | YES | null |  |  | null(null) |

### Table `saml_relay_states`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| sso_provider_id | uuid | NO | null |  |  | auth.sso_providers(id) |
| request_id | text | NO | null |  |  | null(null) |
| for_email | text | YES | null |  |  | null(null) |
| redirect_to | text | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| flow_state_id | uuid | YES | null |  |  | auth.flow_state(id) |

### Table `schema_migrations`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| version | character varying | NO | null | PK |  | null(null) |

### Table `sessions`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| user_id | uuid | NO | null |  |  | auth.users(id) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| factor_id | uuid | YES | null |  |  | null(null) |
| aal | USER-DEFINED | YES | null |  |  | null(null) |
| not_after | timestamp with time zone | YES | null |  |  | null(null) |
| refreshed_at | timestamp without time zone | YES | null |  |  | null(null) |
| user_agent | text | YES | null |  |  | null(null) |
| ip | inet | YES | null |  |  | null(null) |
| tag | text | YES | null |  |  | null(null) |

### Table `sso_domains`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| sso_provider_id | uuid | NO | null |  |  | auth.sso_providers(id) |
| domain | text | NO | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |

### Table `sso_providers`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | null | PK |  | null(null) |
| resource_id | text | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |

### Table `users`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| instance_id | uuid | YES | null |  |  | null(null) |
| id | uuid | NO | null | PK |  | null(null) |
| aud | character varying | YES | null |  |  | null(null) |
| role | character varying | YES | null |  |  | null(null) |
| email | character varying | YES | null |  |  | null(null) |
| encrypted_password | character varying | YES | null |  |  | null(null) |
| email_confirmed_at | timestamp with time zone | YES | null |  |  | null(null) |
| invited_at | timestamp with time zone | YES | null |  |  | null(null) |
| confirmation_token | character varying | YES | null |  |  | null(null) |
| confirmation_sent_at | timestamp with time zone | YES | null |  |  | null(null) |
| recovery_token | character varying | YES | null |  |  | null(null) |
| recovery_sent_at | timestamp with time zone | YES | null |  |  | null(null) |
| email_change_token_new | character varying | YES | null |  |  | null(null) |
| email_change | character varying | YES | null |  |  | null(null) |
| email_change_sent_at | timestamp with time zone | YES | null |  |  | null(null) |
| last_sign_in_at | timestamp with time zone | YES | null |  |  | null(null) |
| raw_app_meta_data | jsonb | YES | null |  |  | null(null) |
| raw_user_meta_data | jsonb | YES | null |  |  | null(null) |
| is_super_admin | boolean | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |
| phone | text | YES | NULL::character varying |  | UQ | null(null) |
| phone_confirmed_at | timestamp with time zone | YES | null |  |  | null(null) |
| phone_change | text | YES | ''::character varying |  |  | null(null) |
| phone_change_token | character varying | YES | ''::character varying |  |  | null(null) |
| phone_change_sent_at | timestamp with time zone | YES | null |  |  | null(null) |
| confirmed_at | timestamp with time zone | YES | null |  |  | null(null) |
| email_change_token_current | character varying | YES | ''::character varying |  |  | null(null) |
| email_change_confirm_status | smallint | YES | 0 |  |  | null(null) |
| banned_until | timestamp with time zone | YES | null |  |  | null(null) |
| reauthentication_token | character varying | YES | ''::character varying |  |  | null(null) |
| reauthentication_sent_at | timestamp with time zone | YES | null |  |  | null(null) |
| is_sso_user | boolean | NO | false |  |  | null(null) |
| deleted_at | timestamp with time zone | YES | null |  |  | null(null) |
| is_anonymous | boolean | NO | false |  |  | null(null) |

## Schema `extensions`

### Table `pg_stat_statements`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| userid | oid | YES | null |  |  | null(null) |
| dbid | oid | YES | null |  |  | null(null) |
| toplevel | boolean | YES | null |  |  | null(null) |
| queryid | bigint | YES | null |  |  | null(null) |
| query | text | YES | null |  |  | null(null) |
| plans | bigint | YES | null |  |  | null(null) |
| total_plan_time | double precision | YES | null |  |  | null(null) |
| min_plan_time | double precision | YES | null |  |  | null(null) |
| max_plan_time | double precision | YES | null |  |  | null(null) |
| mean_plan_time | double precision | YES | null |  |  | null(null) |
| stddev_plan_time | double precision | YES | null |  |  | null(null) |
| calls | bigint | YES | null |  |  | null(null) |
| total_exec_time | double precision | YES | null |  |  | null(null) |
| min_exec_time | double precision | YES | null |  |  | null(null) |
| max_exec_time | double precision | YES | null |  |  | null(null) |
| mean_exec_time | double precision | YES | null |  |  | null(null) |
| stddev_exec_time | double precision | YES | null |  |  | null(null) |
| rows | bigint | YES | null |  |  | null(null) |
| shared_blks_hit | bigint | YES | null |  |  | null(null) |
| shared_blks_read | bigint | YES | null |  |  | null(null) |
| shared_blks_dirtied | bigint | YES | null |  |  | null(null) |
| shared_blks_written | bigint | YES | null |  |  | null(null) |
| local_blks_hit | bigint | YES | null |  |  | null(null) |
| local_blks_read | bigint | YES | null |  |  | null(null) |
| local_blks_dirtied | bigint | YES | null |  |  | null(null) |
| local_blks_written | bigint | YES | null |  |  | null(null) |
| temp_blks_read | bigint | YES | null |  |  | null(null) |
| temp_blks_written | bigint | YES | null |  |  | null(null) |
| blk_read_time | double precision | YES | null |  |  | null(null) |
| blk_write_time | double precision | YES | null |  |  | null(null) |
| temp_blk_read_time | double precision | YES | null |  |  | null(null) |
| temp_blk_write_time | double precision | YES | null |  |  | null(null) |
| wal_records | bigint | YES | null |  |  | null(null) |
| wal_fpi | bigint | YES | null |  |  | null(null) |
| wal_bytes | numeric | YES | null |  |  | null(null) |
| jit_functions | bigint | YES | null |  |  | null(null) |
| jit_generation_time | double precision | YES | null |  |  | null(null) |
| jit_inlining_count | bigint | YES | null |  |  | null(null) |
| jit_inlining_time | double precision | YES | null |  |  | null(null) |
| jit_optimization_count | bigint | YES | null |  |  | null(null) |
| jit_optimization_time | double precision | YES | null |  |  | null(null) |
| jit_emission_count | bigint | YES | null |  |  | null(null) |
| jit_emission_time | double precision | YES | null |  |  | null(null) |

### Table `pg_stat_statements_info`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| dealloc | bigint | YES | null |  |  | null(null) |
| stats_reset | timestamp with time zone | YES | null |  |  | null(null) |

## Schema `public`

### Table `a_programming_levels`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| level_number | integer | NO | null | PK |  | null(null) |
| title | text | NO | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |
| link | text | YES | null |  |  | null(null) |

### Table `a_programming_progress`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  | UQ | null(null) |
| level_number | integer | NO | null |  | UQ | null(null) |
| level_done | boolean | YES | false |  |  | null(null) |

### Table `a_theory_feedback`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  |  | null(null) |
| point_id | text | NO | null |  |  | null(null) |
| layer | text | NO | null |  |  | null(null) |
| feedback_type | text | NO | null |  |  | null(null) |
| comment | text | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | now() |  |  | null(null) |

### Table `a_theory_points`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| point_id | text | NO | null | PK |  | null(null) |
| title | text | NO | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |
| point_order | integer | YES | null |  |  | null(null) |
| link | text | YES | null |  |  | null(null) |

### Table `a_theory_progress`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  | UQ | null(null) |
| point_id | text | NO | null |  | UQ | null(null) |
| layer1_done | boolean | YES | false |  |  | null(null) |
| layer2_done | boolean | YES | false |  |  | null(null) |
| layer3_done | boolean | YES | false |  |  | null(null) |
| layer4_done | boolean | YES | false |  |  | null(null) |

### Table `as_programming_levels`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| level_number | integer | NO | null | PK |  | null(null) |
| title | text | NO | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |

### Table `as_programming_progress`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  | UQ | null(null) |
| level_number | integer | NO | null |  | UQ | null(null) |
| level_done | boolean | YES | false |  |  | null(null) |

### Table `as_theory_points`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| point_id | text | NO | null | PK |  | null(null) |
| title | text | NO | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |
| point_order | integer | YES | null |  |  | null(null) |

### Table `as_theory_progress`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  | UQ | null(null) |
| point_id | text | NO | null |  | UQ | null(null) |
| layer1_done | boolean | YES | false |  |  | null(null) |
| layer2_done | boolean | YES | false |  |  | null(null) |
| layer3_done | boolean | YES | false |  |  | null(null) |
| layer4_done | boolean | YES | false |  |  | null(null) |

### Table `igcse_programming_levels`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| level_number | integer | NO | null | PK |  | null(null) |
| title | text | NO | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |
| link | text | YES | null |  |  | null(null) |

### Table `igcse_programming_progress`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  | UQ | null(null) |
| level_number | integer | NO | null |  | UQ | null(null) |
| level_done | boolean | YES | false |  |  | null(null) |

### Table `igcse_theory_points`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| point_id | text | NO | null | PK |  | null(null) |
| title | text | NO | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |
| point_order | integer | YES | null |  |  | null(null) |
| link | text | YES | null |  |  | null(null) |

### Table `igcse_theory_progress`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| studentid | text | NO | null |  | UQ | null(null) |
| point_id | text | NO | null |  | UQ | null(null) |
| layer1_done | boolean | YES | false |  |  | null(null) |
| layer2_done | boolean | YES | false |  |  | null(null) |
| layer3_done | boolean | YES | false |  |  | null(null) |
| layer4_done | boolean | YES | false |  |  | null(null) |

### Table `students`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| username | text | NO | null |  |  | null(null) |
| password | text | NO | null |  |  | null(null) |
| platform | text | NO | null |  |  | null(null) |
| studentid | text | NO | null |  |  | null(null) |

## Schema `realtime`

### Table `messages`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| topic | text | NO | null |  |  | null(null) |
| extension | text | NO | null |  |  | null(null) |
| payload | jsonb | YES | null |  |  | null(null) |
| event | text | YES | null |  |  | null(null) |
| private | boolean | YES | false |  |  | null(null) |
| updated_at | timestamp without time zone | NO | now() |  |  | null(null) |
| inserted_at | timestamp without time zone | NO | now() | PK |  | null(null) |
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |

### Table `schema_migrations`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| version | bigint | NO | null | PK |  | null(null) |
| inserted_at | timestamp without time zone | YES | null |  |  | null(null) |

### Table `subscription`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | bigint | NO | null | PK |  | null(null) |
| subscription_id | uuid | NO | null |  |  | null(null) |
| entity | regclass | NO | null |  |  | null(null) |
| filters | ARRAY | NO | '{}'::realtime.user_defined_filter[] |  |  | null(null) |
| claims | jsonb | NO | null |  |  | null(null) |
| claims_role | regrole | NO | null |  |  | null(null) |
| created_at | timestamp without time zone | NO | timezone('utc'::text, now()) |  |  | null(null) |

## Schema `storage`

### Table `buckets`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | text | NO | null | PK |  | null(null) |
| name | text | NO | null |  |  | null(null) |
| owner | uuid | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | now() |  |  | null(null) |
| updated_at | timestamp with time zone | YES | now() |  |  | null(null) |
| public | boolean | YES | false |  |  | null(null) |
| avif_autodetection | boolean | YES | false |  |  | null(null) |
| file_size_limit | bigint | YES | null |  |  | null(null) |
| allowed_mime_types | ARRAY | YES | null |  |  | null(null) |
| owner_id | text | YES | null |  |  | null(null) |

### Table `migrations`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | integer | NO | null |  |  | null(null) |
| name | character varying | NO | null |  |  | null(null) |
| hash | character varying | NO | null |  |  | null(null) |
| executed_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |  |  | null(null) |

### Table `objects`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| bucket_id | text | YES | null |  |  | storage.buckets(id) |
| name | text | YES | null |  |  | null(null) |
| owner | uuid | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | now() |  |  | null(null) |
| updated_at | timestamp with time zone | YES | now() |  |  | null(null) |
| last_accessed_at | timestamp with time zone | YES | now() |  |  | null(null) |
| metadata | jsonb | YES | null |  |  | null(null) |
| path_tokens | ARRAY | YES | null |  |  | null(null) |
| version | text | YES | null |  |  | null(null) |
| owner_id | text | YES | null |  |  | null(null) |
| user_metadata | jsonb | YES | null |  |  | null(null) |

### Table `s3_multipart_uploads`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | text | NO | null | PK |  | null(null) |
| in_progress_size | bigint | NO | 0 |  |  | null(null) |
| upload_signature | text | NO | null |  |  | null(null) |
| bucket_id | text | NO | null |  |  | storage.buckets(id) |
| key | text | NO | null |  |  | null(null) |
| version | text | NO | null |  |  | null(null) |
| owner_id | text | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | NO | now() |  |  | null(null) |
| user_metadata | jsonb | YES | null |  |  | null(null) |

### Table `s3_multipart_uploads_parts`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| upload_id | text | NO | null |  |  | storage.s3_multipart_uploads(id) |
| size | bigint | NO | 0 |  |  | null(null) |
| part_number | integer | NO | null |  |  | null(null) |
| bucket_id | text | NO | null |  |  | storage.buckets(id) |
| key | text | NO | null |  |  | null(null) |
| etag | text | NO | null |  |  | null(null) |
| owner_id | text | YES | null |  |  | null(null) |
| version | text | NO | null |  |  | null(null) |
| created_at | timestamp with time zone | NO | now() |  |  | null(null) |

## Schema `vault`

### Table `decrypted_secrets`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | YES | null |  |  | null(null) |
| name | text | YES | null |  |  | null(null) |
| description | text | YES | null |  |  | null(null) |
| secret | text | YES | null |  |  | null(null) |
| decrypted_secret | text | YES | null |  |  | null(null) |
| key_id | uuid | YES | null |  |  | null(null) |
| nonce | bytea | YES | null |  |  | null(null) |
| created_at | timestamp with time zone | YES | null |  |  | null(null) |
| updated_at | timestamp with time zone | YES | null |  |  | null(null) |

### Table `secrets`
| Column | Type | Nullable | Default | PK | Unique | Foreign Key |
|--------|------|----------|---------|----|--------|-------------|
| id | uuid | NO | gen_random_uuid() | PK |  | null(null) |
| name | text | YES | null |  |  | null(null) |
| description | text | NO | ''::text |  |  | null(null) |
| secret | text | NO | null |  |  | null(null) |
| key_id | uuid | YES | null |  |  | null(null) |
| nonce | bytea | YES | vault._crypto_aead_det_noncegen() |  |  | null(null) |
| created_at | timestamp with time zone | NO | CURRENT_TIMESTAMP |  |  | null(null) |
| updated_at | timestamp with time zone | NO | CURRENT_TIMESTAMP |  |  | null(null) |

