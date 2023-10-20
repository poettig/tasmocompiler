import { styled } from '@mui/material/styles';
import {
  Button,
  CircularProgress, Divider,
  FormControl, inputClasses,
  Menu, outlinedInputClasses,
  StepLabel,
  stepLabelClasses, Stepper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const Root = styled('div')({
  width: '100%',
});

export const ToolbarRight = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const ProjectPageContainer = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  marginRight: theme.spacing(2),
}));

export const ProjectPageImage = styled(GitHubIcon)(({ theme }) => ({
  width: '100%',
  height: '100%',
  color: theme.palette.background.paper,
}));

const commonLanguagesStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  cursor: 'pointer',
};
export const LanguagesContainer = styled('div')(commonLanguagesStyle);
export const SelectedLanguage = styled(Typography)(commonLanguagesStyle);

export const LanguagesIcon = styled(LanguageIcon)(({ theme }) => ({
  marginLeft: theme.spacing(),
}));

export const LanguagesList = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(),
}));

export const FlagIcon = styled('img')(({ theme }) => ({
  width: 24,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.primary.dark,
}));

export const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  [`& .${stepLabelClasses.label}`]: {
    fontSize: theme.typography.body1.fontSize,
  },
}));

export const ProgressIndicator = styled(CircularProgress)({
  color: 'default',
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: -12,
  marginLeft: -12,
});

export const Wrapper = styled('div')(({ theme }) => ({
  margin: theme.spacing(),
  position: 'relative',
}));

const commonActionsStyle = ({ theme }) => ({
  margin: theme.spacing(2),
  minWidth: 240,
  maxWidth: '80%',
  display: 'flex',
  flexWrap: 'wrap',
});
export const ActionsContainer = styled('div')(commonActionsStyle);
export const ActionsForm = styled('form')(commonActionsStyle);

export const VersionFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(2),
  minWidth: 160,
}));

export const LanguageFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(2),
  maxWidth: 400,
  minWidth: 160,
}));

export const TasmotaConfigSelector = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(),
  width: 160,
}));

export const MultiTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(),
  [`& .${inputClasses.input}`]: {
    fontFamily: 'monospace',
  },
}));

export const CompileMessagesBox = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  marginTop: 0,
  maxWidth: '80%',
  [`& .${outlinedInputClasses.input}`]: {
    fontFamily: 'monospace',
  },
}));

export const CheckboxContainer = styled('div')(({ theme }) => ({
  marginBottom: 0,
  marginLeft: theme.spacing(),
  minWidth: 230,
  maxWidth: 230,
}));

export const RadioContainer = styled('div')(({ theme }) => ({
  marginBottom: 0,
  marginLeft: theme.spacing(),
  minWidth: 230,
  maxWidth: 230,
}));

export const FeaturesHeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(),
}));

export const ChipTypesContainer = styled('div')({});

const commonLinkStyle = ({ theme }) => ({
  marginLeft: theme.spacing(3),
  marginBottom: theme.spacing(3),
});
export const Link = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));
export const LinkTypography = styled(Typography)(commonLinkStyle);

export const DonationLinks = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1),
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '80%',
  position: 'relative',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.primary.dark,
  borderRadius: theme.shape.borderRadius,
}));

export const DonationImage = styled('div')(({ theme }) => ({
  width: 36,
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

export const IconLeft = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(),
}));

export const IconRight = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(),
}));

export const DownloadButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  marginTop: theme.spacing(),
  marginBottom: theme.spacing(),
  position: 'relative',
}));

export const BoardsDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(),
  marginBottom: theme.spacing(),
}));
