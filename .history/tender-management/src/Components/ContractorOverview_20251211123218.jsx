import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, ArrowRight, File, Receipt, Landmark, Info, Mail, Pencil, Phone, MapPin, User, Calendar } from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa';

// --- PLACEHOLDER CONSTANTS ---
// Replace these with your actual definitions
const bluePrimary = "#007bff";
const STORAGE_KEY = "contractorFormData";

const entityTypeOptions = [{ value: 'corp', label: 'Corporation' }];
const taxTypeOptions = [{ value: 'vat', label: 'VAT' }];
const territoryTypeOptions = [{ value: 'state', label: 'State' }];
const territoryOptions = [{ value: 'tx', label: 'Texas' }];
const taxCityOptions = [{ value: 'dallas', label: 'Dallas' }];
const additionalInfoTypeOptions = [{ value: 'license', label: 'License' }];
const addressTypeOptions = [{ value: 'hq', label: 'Headquarters' }];
const countryOptions = [{ value: 'usa', label: 'USA' }];
const addresscityOptions = [{ value: 'houston', label: 'Houston' }];
const contactPositionOptions = [{ value: 'manager', label: 'Manager' }];
// --- END PLACEHOLDER CONSTANTS ---