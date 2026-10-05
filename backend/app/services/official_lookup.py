"""
Official Portal & Domain Resolution Service (SerpApi Verified Pattern).

Connects extracted paperwork entities (providers, brands, statutory bodies) to
official, verified portal URLs for one-click bill payments and warranty registrations,
preventing fake/phishing links.
"""

from typing import Dict, Any, Optional

VERIFIED_DIRECTORY: Dict[str, Dict[str, Any]] = {
    "torrent power": {
        "entity_name": "Torrent Power Ltd",
        "official_domain": "torrentpower.com",
        "action_type": "pay_bill",
        "action_label": "Official QuickPay Portal",
        "portal_url": "https://connect.torrentpower.com/tplcp/index.php/crCustmast/quickpay",
        "is_verified": True,
        "security_badge": "Official Verified Utility Domain"
    },
    "bses": {
        "entity_name": "BSES Delhi (BRPL / BYPL)",
        "official_domain": "bsesdelhi.com",
        "action_type": "pay_bill",
        "action_label": "Official BSES Instant Payment",
        "portal_url": "https://www.bsesdelhi.com/web/brpl/instant-payment",
        "is_verified": True,
        "security_badge": "Official State Discom Portal"
    },
    "adani electricity": {
        "entity_name": "Adani Electricity Mumbai",
        "official_domain": "adanielectricity.com",
        "action_type": "pay_bill",
        "action_label": "Adani Electricity QuickPay",
        "portal_url": "https://www.adanielectricity.com/quick-pay",
        "is_verified": True,
        "security_badge": "Official Utility Domain"
    },
    "tata power": {
        "entity_name": "Tata Power",
        "official_domain": "tatapower.com",
        "action_type": "pay_bill",
        "action_label": "Tata Power Portal",
        "portal_url": "https://www.tatapower.com/customers/pay-bills-online.aspx",
        "is_verified": True,
        "security_badge": "Official Verified Utility Domain"
    },
    "samsung": {
        "entity_name": "Samsung Electronics",
        "official_domain": "samsung.com",
        "action_type": "warranty_claim",
        "action_label": "Samsung Service & Warranty Support",
        "portal_url": "https://www.samsung.com/in/support/your-service/register-product/",
        "is_verified": True,
        "security_badge": "Official Manufacturer Support"
    },
    "lg": {
        "entity_name": "LG Electronics",
        "official_domain": "lg.com",
        "action_type": "warranty_claim",
        "action_label": "LG Official Product Registration",
        "portal_url": "https://www.lg.com/in/support/product-registration",
        "is_verified": True,
        "security_badge": "Official Manufacturer Support"
    },
    "daikin": {
        "entity_name": "Daikin Airconditioning",
        "official_domain": "daikinindia.com",
        "action_type": "warranty_claim",
        "action_label": "Daikin Customer Care Portal",
        "portal_url": "https://www.daikinindia.com/service-request",
        "is_verified": True,
        "security_badge": "Official Manufacturer Support"
    },
    "municipal": {
        "entity_name": "Municipal Corporation Property Tax",
        "official_domain": "gov.in",
        "action_type": "pay_tax",
        "action_label": "Property Tax Citizen Portal",
        "portal_url": "https://mcdonline.nic.in/ptax/citizen/gateway",
        "is_verified": True,
        "security_badge": "Official Government Citizen Portal"
    }
}

class OfficialActionResolver:
    """Resolves confirmed document entities to safe verified URLs."""

    def resolve_portal(self, entity_keyword: Optional[str], doc_type: Optional[str] = None) -> Optional[Dict[str, Any]]:
        if not entity_keyword:
            return None

        kw_lower = str(entity_keyword).lower().strip()
        for key, info in VERIFIED_DIRECTORY.items():
            if key in kw_lower or kw_lower in key:
                return info

        return None

official_resolver = OfficialActionResolver()
