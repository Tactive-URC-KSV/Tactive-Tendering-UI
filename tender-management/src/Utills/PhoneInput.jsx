import { useState, useRef, useEffect } from 'react';

/**
 * Country phone rules:
 * dialCode   - international dial prefix (without +)
 * digitCount - exact number of local digits required
 * startsWith - valid first-digit regex patterns for local number
 */
export const COUNTRY_PHONE_RULES = [
    { code: 'IN', name: 'India',          flag: '🇮🇳', dialCode: '91',  digitCount: 10, startsWith: ['[6-9]'] },
    { code: 'US', name: 'USA',            flag: '🇺🇸', dialCode: '1',   digitCount: 10, startsWith: ['[2-9]'] },
    { code: 'GB', name: 'UK',             flag: '🇬🇧', dialCode: '44',  digitCount: 10, startsWith: ['[1-9]'] },
    { code: 'AU', name: 'Australia',      flag: '🇦🇺', dialCode: '61',  digitCount: 9,  startsWith: ['[4-9]'] },
    { code: 'CA', name: 'Canada',         flag: '🇨🇦', dialCode: '1',   digitCount: 10, startsWith: ['[2-9]'] },
    { code: 'AE', name: 'UAE',            flag: '🇦🇪', dialCode: '971', digitCount: 9,  startsWith: ['[5]'] },
    { code: 'SA', name: 'Saudi Arabia',   flag: '🇸🇦', dialCode: '966', digitCount: 9,  startsWith: ['[5]'] },
    { code: 'SG', name: 'Singapore',      flag: '🇸🇬', dialCode: '65',  digitCount: 8,  startsWith: ['[689]'] },
    { code: 'MY', name: 'Malaysia',       flag: '🇲🇾', dialCode: '60',  digitCount: 10, startsWith: ['[1]'] },
    { code: 'PK', name: 'Pakistan',       flag: '🇵🇰', dialCode: '92',  digitCount: 10, startsWith: ['[3]'] },
    { code: 'BD', name: 'Bangladesh',     flag: '🇧🇩', dialCode: '880', digitCount: 10, startsWith: ['[1]'] },
    { code: 'LK', name: 'Sri Lanka',      flag: '🇱🇰', dialCode: '94',  digitCount: 9,  startsWith: ['[7]'] },
    { code: 'NP', name: 'Nepal',          flag: '🇳🇵', dialCode: '977', digitCount: 10, startsWith: ['[9]'] },
    { code: 'JP', name: 'Japan',          flag: '🇯🇵', dialCode: '81',  digitCount: 10, startsWith: ['[7-9]'] },
    { code: 'CN', name: 'China',          flag: '🇨🇳', dialCode: '86',  digitCount: 11, startsWith: ['[1]'] },
    { code: 'KR', name: 'South Korea',    flag: '🇰🇷', dialCode: '82',  digitCount: 10, startsWith: ['[1]'] },
    { code: 'DE', name: 'Germany',        flag: '🇩🇪', dialCode: '49',  digitCount: 11, startsWith: ['[1-9]'] },
    { code: 'FR', name: 'France',         flag: '🇫🇷', dialCode: '33',  digitCount: 9,  startsWith: ['[6-7]'] },
    { code: 'IT', name: 'Italy',          flag: '🇮🇹', dialCode: '39',  digitCount: 10, startsWith: ['[3]'] },
    { code: 'ES', name: 'Spain',          flag: '🇪🇸', dialCode: '34',  digitCount: 9,  startsWith: ['[6-7]'] },
    { code: 'RU', name: 'Russia',         flag: '🇷🇺', dialCode: '7',   digitCount: 10, startsWith: ['[9]'] },
    { code: 'BR', name: 'Brazil',         flag: '🇧🇷', dialCode: '55',  digitCount: 11, startsWith: ['[1-9]'] },
    { code: 'MX', name: 'Mexico',         flag: '🇲🇽', dialCode: '52',  digitCount: 10, startsWith: ['[1-9]'] },
    { code: 'ZA', name: 'South Africa',   flag: '🇿🇦', dialCode: '27',  digitCount: 9,  startsWith: ['[6-8]'] },
    { code: 'NG', name: 'Nigeria',        flag: '🇳🇬', dialCode: '234', digitCount: 10, startsWith: ['[7-9]'] },
    { code: 'KE', name: 'Kenya',          flag: '🇰🇪', dialCode: '254', digitCount: 9,  startsWith: ['[7]'] },
    { code: 'EG', name: 'Egypt',          flag: '🇪🇬', dialCode: '20',  digitCount: 10, startsWith: ['[1]'] },
    { code: 'ID', name: 'Indonesia',      flag: '🇮🇩', dialCode: '62',  digitCount: 12, startsWith: ['[8]'] },
    { code: 'PH', name: 'Philippines',    flag: '🇵🇭', dialCode: '63',  digitCount: 10, startsWith: ['[9]'] },
    { code: 'TH', name: 'Thailand',       flag: '🇹🇭', dialCode: '66',  digitCount: 9,  startsWith: ['[6-9]'] },
    { code: 'VN', name: 'Vietnam',        flag: '🇻🇳', dialCode: '84',  digitCount: 9,  startsWith: ['[3-9]'] },
    { code: 'QA', name: 'Qatar',          flag: '🇶🇦', dialCode: '974', digitCount: 8,  startsWith: ['[3-7]'] },
    { code: 'KW', name: 'Kuwait',         flag: '🇰🇼', dialCode: '965', digitCount: 8,  startsWith: ['[5-9]'] },
    { code: 'OM', name: 'Oman',           flag: '🇴🇲', dialCode: '968', digitCount: 8,  startsWith: ['[9]'] },
    { code: 'BH', name: 'Bahrain',        flag: '🇧🇭', dialCode: '973', digitCount: 8,  startsWith: ['[3-6]'] },
    { code: 'JO', name: 'Jordan',         flag: '🇯🇴', dialCode: '962', digitCount: 9,  startsWith: ['[7-9]'] },
    { code: 'NZ', name: 'New Zealand',    flag: '🇳🇿', dialCode: '64',  digitCount: 9,  startsWith: ['[2]'] },
];

export function validatePhoneNumber(localNumber, countryRule) {
    if (!localNumber) return { valid: false, error: null };
    const digits = localNumber.replace(/\D/g, '');
    if (!digits) return { valid: false, error: 'Only digits allowed' };
    if (countryRule.startsWith && countryRule.startsWith.length > 0) {
        const ok = countryRule.startsWith.some(p => new RegExp(`^${p}`).test(digits));
        if (!ok) return { valid: false, error: `Must start with ${countryRule.startsWith.join(' or ')}` };
    }
    if (countryRule.digitCount && digits.length !== countryRule.digitCount) {
        return { valid: false, error: `Must be exactly ${countryRule.digitCount} digits` };
    }
    return { valid: true, error: null };
}

export function buildFullPhone(dialCode, localNumber) {
    const digits = (localNumber || '').replace(/\D/g, '');
    return digits ? `+${dialCode}${digits}` : '';
}

export function parseFullPhone(fullPhone) {
    if (!fullPhone) return { dialCode: '91', localNumber: '', countryCode: 'IN' };
    const str = fullPhone.startsWith('+') ? fullPhone.slice(1) : fullPhone;
    const sorted = [...COUNTRY_PHONE_RULES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const rule of sorted) {
        if (str.startsWith(rule.dialCode)) {
            return { dialCode: rule.dialCode, localNumber: str.slice(rule.dialCode.length), countryCode: rule.code };
        }
    }
    return { dialCode: '91', localNumber: str, countryCode: 'IN' };
}

/**
 * PhoneInput — styled to exactly match the project's floating-label form fields.
 *
 * Usage (in parent, same as any other input):
 *   <div className="col-md-6 mb-4 position-relative">
 *     <label className="projectform d-block">Phone No</label>
 *     <PhoneInput value={...} onChange={...} />
 *   </div>
 *
 * The component renders:
 *   1. A bordered flex container (identical to .form-input height/border/radius)
 *      → The .projectform label floats on its top border exactly like other fields
 *   2. A digit counter div below (like other fields)
 *   3. An error message below (on validation fail, after blur)
 *   4. A dropdown inside the container (position:absolute, overflows below)
 */
function PhoneInput({ value = '', onChange, disabled = false, required = false, defaultCountryCode = 'IN' }) {
    const parsed = parseFullPhone(value);
    const defaultRule = COUNTRY_PHONE_RULES.find(r => r.code === defaultCountryCode) || COUNTRY_PHONE_RULES[0];

    const [selectedCountry, setSelectedCountry] = useState(
        COUNTRY_PHONE_RULES.find(r => r.code === parsed.countryCode) || defaultRule
    );
    const [localNumber, setLocalNumber] = useState(parsed.localNumber);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [touched, setTouched] = useState(false);

    // ref on the BORDERED CONTAINER itself (no outer wrapper)
    const containerRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const p = parseFullPhone(value);
        const rule = COUNTRY_PHONE_RULES.find(r => r.code === p.countryCode);
        if (rule && rule.code !== selectedCountry.code) setSelectedCountry(rule);
        setLocalNumber(p.localNumber);
    }, [value]);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setDropdownOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (dropdownOpen && searchRef.current) searchRef.current.focus();
    }, [dropdownOpen]);

    const filteredCountries = COUNTRY_PHONE_RULES.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.dialCode.includes(search) ||
        r.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleCountrySelect = (rule) => {
        setSelectedCountry(rule);
        setDropdownOpen(false);
        setSearch('');
        setLocalNumber('');
        if (onChange) onChange('');
    };

    const handleNumberChange = (e) => {
        setTouched(true);
        const raw = e.target.value.replace(/\D/g, '');
        const trimmed = raw.slice(0, selectedCountry.digitCount || 15);
        setLocalNumber(trimmed);
        if (onChange) onChange(trimmed ? buildFullPhone(selectedCountry.dialCode, trimmed) : '');
    };

    const { valid, error } = validatePhoneNumber(localNumber, selectedCountry);
    const showError = touched && localNumber && !valid;
    const placeholder = selectedCountry.digitCount ? `Enter ${selectedCountry.digitCount}-digit number` : 'Enter phone number';

    return (
        <>
            {/*
              ┌─────────────────────────────────────────────────────┐
              │  Single bordered container — same height/border as   │
              │  .form-input so the .projectform label floats on     │
              │  its top border exactly like Zip Code, Email, etc.   │
              └─────────────────────────────────────────────────────┘
            */}
            <div
                ref={containerRef}
                style={{
                    position: 'relative',     /* anchor for the dropdown */
                    display: 'flex',
                    alignItems: 'center',
                    height: '50px',           /* matches .form-input height */
                    border: `1px solid ${showError ? '#dc3545' : '#005197CC'}`,  /* matches .form-input border */
                    borderRadius: '8px',      /* matches .form-input border-radius */
                    background: disabled ? '#f8f9fa' : '#fff',
                    width: '100%',
                    overflow: 'visible',      /* allow dropdown to overflow below */
                    boxSizing: 'border-box',
                }}
            >
                {/* ── Country code selector button ── */}
                <button
                    type="button"
                    onClick={() => !disabled && setDropdownOpen(o => !o)}
                    disabled={disabled}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: '100%',
                        padding: '0 8px 0 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRight: '1px solid #005197CC',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        outline: 'none',
                        borderRadius: '7px 0 0 7px',
                    }}
                    title={`${selectedCountry.name} (+${selectedCountry.dialCode})`}
                >
                    <span style={{ fontWeight: 600, color: '#333', fontSize: '13px' }}>{selectedCountry.code}</span>
                    <span style={{ fontWeight: 600, color: '#005197', fontSize: '13px' }}>+{selectedCountry.dialCode}</span>
                    <span style={{ fontSize: '9px', color: '#888' }}>▼</span>
                </button>

                {/* ── Phone number text input ── */}
                <input
                    type="text"
                    inputMode="numeric"
                    value={localNumber}
                    onChange={handleNumberChange}
                    onBlur={() => setTouched(true)}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder}
                    maxLength={selectedCountry.digitCount || 15}
                    style={{
                        flex: 1,
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '14px',
                        color: '#000',
                        caretColor: '#000',
                        paddingLeft: '14px',
                        minWidth: 0,
                    }}
                />

                {/* ── Country dropdown (positioned below the container) ── */}
                {dropdownOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '52px',
                            left: 0,
                            zIndex: 9999,
                            background: '#fff',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
                            minWidth: '270px',
                            maxHeight: '300px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Search */}
                        <div style={{ padding: '8px 10px', borderBottom: '1px solid #dee2e6' }}>
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search country..."
                                style={{
                                    width: '100%',
                                    padding: '6px 10px',
                                    border: '1px solid #005197CC',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        {/* List */}
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {filteredCountries.map(rule => (
                                <div
                                    key={rule.code}
                                    onClick={() => handleCountrySelect(rule)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 14px',
                                        cursor: 'pointer',
                                        background: rule.code === selectedCountry.code ? '#e8f0fe' : 'transparent',
                                        fontSize: '13px',
                                    }}
                                    onMouseEnter={e => { if (rule.code !== selectedCountry.code) e.currentTarget.style.background = '#f5f5f5'; }}
                                    onMouseLeave={e => { if (rule.code !== selectedCountry.code) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <span style={{ fontSize: '18px' }}>{rule.flag}</span>
                                    <span style={{ flex: 1, color: '#333' }}>{rule.name}</span>
                                    <span style={{ color: '#005197', fontWeight: 600 }}>+{rule.dialCode}</span>
                                </div>
                            ))}
                            {filteredCountries.length === 0 && (
                                <div style={{ padding: '16px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                                    No countries found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Digit counter BELOW (matching all other form fields) ── */}
            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                {localNumber.length}/{selectedCountry.digitCount || '—'}
            </div>

            {/* ── Inline validation error ── */}
            {showError && error && (
                <small style={{ color: '#dc3545', fontSize: '11px', display: 'block', marginTop: '1px' }}>
                    {error}
                </small>
            )}
        </>
    );
}

export default PhoneInput;
