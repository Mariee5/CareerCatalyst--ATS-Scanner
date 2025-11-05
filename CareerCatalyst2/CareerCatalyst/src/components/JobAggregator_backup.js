import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Card,
  CardContent,
  CardActions,
  Stack,
  OutlinedInput,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Autocomplete
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import './JobAggregator.css';

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 
  'Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'DevOps Engineer',
  'UI/UX Designer', 'Graphic Designer', 'Product Manager', 'Project Manager',
  'Marketing Manager', 'Digital Marketing', 'Content Writer', 'Sales Executive',
  'HR Manager', 'Business Analyst', 'QA Engineer', 'Mobile Developer',
  'Cybersecurity Analyst', 'Cloud Engineer', 'Database Administrator', 'Other'
];

const LOCATIONS = [
  'Remote', 'Hybrid', 'On-site', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
  'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna'
];

const TYPES = ['Full-Time', 'Internship', 'Contract', 'Part-Time', 'Freelance', 'Temporary'];
const WORK_HOURS = ['Day', 'Night', 'Flexible', 'Rotational', 'Weekend', 'Evening'];
const SHIFTS = ['Morning (6 AM - 2 PM)', 'Afternoon (2 PM - 10 PM)', 'Night (10 PM - 6 AM)', 'Rotational', 'Flexible'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site', 'Work from Home'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director'];
const SALARY_RANGES = ['0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15-25 LPA', '25+ LPA'];

const SOURCES = [
  { key: 'internshala', label: 'Internshala' },
  { key: 'glassdoor', label: 'Glassdoor' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'indeed', label: 'Indeed' }
];

const DUMMY_JOBS = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'Bangalore',
    type: 'Full-Time',
    work_hours: 'Day',
    shift: 'Morning (6 AM - 2 PM)',
    work_mode: 'Hybrid',
    experience: 'Senior Level',
    salary: '15-25 LPA',
    source: 'linkedin',
    link: 'https://www.linkedin.com/jobs/view/senior-frontend-developer-techcorp',
    description: 'Build scalable web applications using React, TypeScript, and modern frontend technologies.'
  },
  {
    title: 'Data Science Intern',
    company: 'AI Innovations',
    location: 'Remote',
    type: 'Internship',
    work_hours: 'Flexible',
    shift: 'Flexible',
    work_mode: 'Remote',
    experience: 'Entry Level',
    salary: '3-6 LPA',
    source: 'internshala',
    link: 'https://internshala.com/internship/detail/data-science-intern-ai-innovations',
    description: 'Work on machine learning projects and data analysis using Python and SQL.'
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Studios',
    location: 'Mumbai',
    type: 'Full-Time',
    work_hours: 'Day',
    shift: 'Morning (6 AM - 2 PM)',
    work_mode: 'On-site',
    experience: 'Mid Level',
    salary: '10-15 LPA',
    source: 'glassdoor',
    link: 'https://www.glassdoor.com/job-listing/ui-ux-designer-creative-studios-JV_IC2295383_KO0,14',
    description: 'Design user interfaces and experiences for web and mobile applications.'
  }
];

function JobAggregator() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [shift, setShift] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');
  const [selectedSources, setSelectedSources] = useState(SOURCES.map(s => s.key));
  const [jobs, setJobs] = useState(DUMMY_JOBS);
  const [showLocationMap, setShowLocationMap] = useState(false);

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    const matchesSource = selectedSources.includes(job.source);
    const matchesRole = !role || job.title.toLowerCase().includes(role.toLowerCase());
    return matchesSource && matchesRole;
  });

  const handleSourceChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSources(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSearch = () => {
    // In a real app, you would fetch from the backend here
    console.log('Searching jobs...');
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowLocationMap(false);
  };

  return (
    <Box className="jobagg-bg" sx={{
      maxWidth: 1200,
      margin: '40px auto',
      padding: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '80vh',
      position: 'relative',
      zIndex: 1,
    }}>
      <Typography variant="h4" fontWeight={700} mb={3} align="center" sx={{ position: 'relative', zIndex: 1 }}>
        Job Aggregator
      </Typography>
      
      <Button 
        onClick={() => navigate('/')} 
        variant="contained" 
        sx={{ 
          float: 'right', 
          bgcolor: '#4a7c59', 
          '&:hover': { bgcolor: '#3d6b4a' },
          mb: 2,
          position: 'relative',
          zIndex: 1
        }}
      >
        Back to Home
      </Button>
      
      {/* Filters Section */}
      <Box sx={{ 
        bgcolor: 'white', 
        p: 4, 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(74, 124, 89, 0.1)', 
        mb: 4,
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(74, 124, 89, 0.1)',
      }}>
        <Typography variant="h6" sx={{ color: '#4a7c59', mb: 3, fontWeight: 600 }}>
          Search Filters
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="subtitle2" sx={{ color: '#4a7c59', mb: 1 }}>
              Role
            </Typography>
            <Autocomplete
              freeSolo
              options={ROLES}
              value={role}
              onInputChange={(e, newValue) => setRole(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Type or select a role" variant="outlined" size="small" />
              )}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography variant="subtitle2" sx={{ color: '#4a7c59', mb: 1 }}>
              Location
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={location} displayEmpty onChange={e => setLocation(e.target.value)}>
                <MenuItem value="">Any Location</MenuItem>
                {LOCATIONS.slice(0, 20).map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, minWidth: 150 }}>
            <Typography variant="subtitle2" sx={{ color: '#4a7c59', mb: 1 }}>
              Job Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={type} displayEmpty onChange={e => setType(e.target.value)}>
                <MenuItem value="">Any Type</MenuItem>
                {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, minWidth: 150, alignSelf: 'end' }}>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                bgcolor: '#4a7c59', 
                height: '40px', 
                fontWeight: 600,
                '&:hover': { bgcolor: '#3d6b4a' }
              }} 
              onClick={handleSearch}
            >
              Search Jobs
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Jobs Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ color: '#4a7c59', mb: 3, fontWeight: 600 }}>
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </Typography>
        {filteredJobs.length === 0 ? (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No jobs found. Try adjusting your filters.
          </Typography>
        ) : (
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            spacing={3}
            sx={{ width: '100%', mt: 4, gap: 3 }}
          >
            {filteredJobs.map((job, idx) => (
              <Card
                key={idx}
                className="job-card"
                sx={{
                  width: 340,
                  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s',
                  boxShadow: 3,
                  borderRadius: 3,
                  ':hover': {
                    transform: 'translateY(-10px) scale(1.03)',
                    boxShadow: 8,
                  },
                }}
              >
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <Chip
                    label={SOURCES.find(s => s.key === job.source)?.label || job.source}
                    sx={{ 
                      bgcolor: '#4a7c59', 
                      color: '#fff', 
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: '#4a7c59' }}>
                      {job.source === 'glassdoor' ? <BusinessIcon /> : 
                        job.source === 'internshala' ? <WorkIcon /> : <PublicIcon />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                        {job.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {job.company}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: '#4a7c59' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={job.type} 
                      size="small" 
                      sx={{ mr: 1, mb: 1, bgcolor: '#e8f5e8', color: '#4a7c59' }}
                    />
                    <Chip 
                      label={job.experience} 
                      size="small" 
                      sx={{ mr: 1, mb: 1, bgcolor: '#e8f5e8', color: '#4a7c59' }}
                    />
                    <Chip 
                      label={job.salary} 
                      size="small" 
                      sx={{ mr: 1, mb: 1, bgcolor: '#e8f5e8', color: '#4a7c59' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: '#4a5568' }}>
                    {job.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    href={job.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    sx={{ 
                      ml: 1, 
                      color: '#111', 
                      borderColor: '#111',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#111', color: 'white', borderColor: '#111' }
                    }}
                  >
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default JobAggregator;
