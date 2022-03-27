<?php

namespace App\Enums;

// If you upgrade the infrastrucutre to run PHP 8.1 you can rewrite this to use the new enum keyword
abstract class ESubjectLevels {
    const ElevenPlus = '11 Plus';
    const ThirteenPlus = '13 Plus';
    const KS1 = 'KS1 (5-7 yrs)';
    const KS2 = 'KS2 (7-11 yrs)';
    const KS3 = 'KS3 (11-14 yrs)';
    const GCSE = 'GCSE (15-16 yrs)';
    const ALevel = 'A-Level';
    const IB = 'IB';
    const National45 = 'National 4 & 5';
    const ScottishHighers = 'Scottish Highers';
    const Degree = 'Degree (or higher)';
    const Adult = 'Adult Learner';
    const Beginner = 'Beginner';
    const Intermediate = 'Intermediate';
    const Advanced = 'Advanced';
    const Grade13 = 'Grade 1-3';
    const Grade45 = 'Grade 4-5';
    const Grade67 = 'Grade 6-7';
    const Grade8Plus = 'Grade 8+';
    
    // Naming this cases to fall inline with the upcoming enum keyword functionality
    public static function cases() {
        return [
            Self::ElevenPlus,
            Self::ThirteenPlus,
            Self::KS1,
            Self::KS2,
            Self::KS3,
            Self::GCSE,
            Self::ALevel,
            Self::IB,
            Self::National45,
            Self::ScottishHighers,
            Self::Degree,
            Self::Adult,
            Self::Beginner,
            Self::Intermediate,
            Self::Advanced,
            Self::Grade13,
            Self::Grade45,
            Self::Grade67,
            Self::Grade8Plus
        ];
    }
}
